<template>
    <div class="message" :class="message.role">
        <div class="message-header">
            <strong class="role">{{ message.role=="human"?"🧠":"🔮"}}</strong>
            <small>
                (
                <code v-show="name!=''">{{ name }}</code>
                <code v-show="prompt!=''">, 📑{{ prompt }}</code>
                <code v-show="temp!=''">, 🌡️{{parseFloat(temp).toFixed(2)}}</code>
                )
            </small>
            <button class="copy-button" title="copy raw text of full message" @click="copyToClipboard($event,true,false)">📋</button>
        </div>
        <span v-html="renderMarkdown(message.content)"></span>
    </div>
</template>
  
<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = new MarkdownIt({
    breaks: true,
    fence: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {
                // whoops 🤷‍♂️
            }
        }
        return '';
    }
});

md.block.ruler.disable('code');

md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const type = md.utils.escapeHtml(token.info)



    let content = token.content;
    if (token.info && hljs.getLanguage(token.info)) {
        content = hljs.highlight(token.info, content).value;
    } else {
        content = md.utils.escapeHtml(content);
    }

    const button = '<button class="copy-button" title="copy text" @click="copyToClipboard">📋</button><button class="copy-button" title = "copy text in code fence" @click="copyToClipboard($event,false,true)">`…`</button>';

    return `<div class="codeblock"> \
                
                <div class="codeheader"> \
                    <div class="codelabel">
                        ${type}
                    </div>
                    ${button} \
                </div> \
                <div class="codebody"> \
                    <pre><code>${content}</code></pre> \
                </div> \
            </div>`;
};
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // Add target="_blank" to all links
    tokens[idx].attrPush(['target', '_blank']);
    // pass token to default renderer.
    return self.renderToken(tokens, idx, options);
};

export default {
    mounted() {
        this.$el.querySelectorAll('.copy-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                const codeBlock = event.target.closest('.codeblock');
                const code = codeBlock.querySelector('code').textContent;
                try {
                    navigator.clipboard.writeText(code);
                } catch (err) {
                    this.unsecuredCopyToClipboard(code);
                }
            });
        });
    },
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    computed: {
        name() {
            return this.message.name || '';
        },
        temp() {
            return this.message.temp || '';
        },
        prompt() {
            return this.message.prompt || '';
        }
    },
    methods: {
        renderMarkdown(markdownString) {
            return md.render(markdownString);
        },
        async copyToClipboard(event, fullMessage = false, addCodeFences = false) {
            let textToCopy; // Define textToCopy in the scope of the function.

            if (fullMessage) {
                textToCopy = this.message.content; // Assign value to textToCopy.
            }
            else {
                const codeBlock = event.target.closest('.codeblock');
                textToCopy = codeBlock.querySelector('code').textContent; // Assign value to textToCopy.
            }

            if (addCodeFences){
                textToCopy = "```\n" + textToCopy + "\n```"; // Reassign textToCopy with code fences.
            }

            try {
                await navigator.clipboard.writeText(textToCopy);
                console.log('Copying to clipboard was successful!');
            } catch (err) {
                console.error('Could not copy text: ', err);
            }
        }
    }
};
</script>

<style scoped>
.message {
    display: flex;
    flex-direction: column;
    width: 85%;
    padding: 10px;
    margin-bottom: 10px;
    border: 2px solid;
    border-radius: 30px;
    color: white;
    font-size: 12pt;
    font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    overflow: none;
    overflow-wrap: break-word;
    /*  word-break: break-all; */
    /*white-space: pre-wrap;*/
}

.message ::v-deep {
    margin-top: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
}

:deep a{
    color: #FF00FF;
}

:deep a:visited{
    color: #9500ff;
}

.message.human {
    align-self: flex-end;
    background-color: #0D0019;
    color: #ff60ff;
    border-color: #ff00ff88;
    border-bottom-right-radius: 0;
    margin-right: 10px;
}

.message.ai {
    align-self: flex-start;
    background-color: #0D0019;
    color: #57f9ff;
    border-color: #57f9ff88;
    border-bottom-left-radius: 0;
    margin-left: 10px;
}

.role{
    font-size: 16pt;
    font-family: monospace;
}

:deep(.codeblock) {
    border-radius: 10px;
}

:deep(.codeheader) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #181818;
    border-radius: 10px 10px 0 0;
}

:deep(.codelabel) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    font-size: 10pt;
    font-family: robot-mono, monospace;
    color: #F2058C;
}

:deep(.copy-button) {
    display: flex;
    padding: 5px;
    background: none;
    border-width: 1px;
    border-radius: 10px;
    border-color: #00000088;
    color: white;
    cursor:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>📋</text></svg>") 16 0,auto; /*!emojicursor.app*/
    font-family: roboto mono, monospace;
    font-size: 10pt;
    text-align: center;
    padding: 5px;
}

message-header {
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.codebody) {
    background-color: #00000088;
    overflow-y: auto;
    color: #F2058C;
    border-radius: 0 0 10px 10px;
    padding-left: 10px;
}

:deep(.codebody)::-webkit-scrollbar {
    width: 4px;
    height: 8px;
}

:deep(.codebody)::-webkit-scrollbar-track {
    background: transparent;
}

:deep(.codebody)::-webkit-scrollbar-thumb {
    background-color: rgba(125, 125, 125, 0.7);
    border-radius: 4px;
}






@keyframes slidein {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.message {
    animation: slidein 0.5s ease;
    /* rest of your css */

}

code {
    color: #FF00A8;
}


@import 'highlight.js/styles/default.css';

.hljs {
    background: #1a1b26;
    color: #978a8a;
}

.hljs-string {
    color: #e58f65;
}

.hljs-keyword {
    color: #d4759b;
}


/* add more as needed */
</style>
  