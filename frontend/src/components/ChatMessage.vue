<template>
    <div class="message" :class="message.role">
        <strong>{{ message.role }}</strong>
        <span v-html="renderMarkdown(message.content)"></span>
    </div>
</template>
  
<script>
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const type = md.utils.escapeHtml(token.info)
    const content = md.utils.escapeHtml(token.content);
    const button = '<button class="copy-button">📋 copy code</button>';

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

export default {
    mounted() {
        this.$el.querySelectorAll('.copy-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                const codeBlock = event.target.closest('.codeblock');
                const code = codeBlock.querySelector('code').textContent;
                try{
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
    methods: {
        renderMarkdown(markdownString) {
            return md.render(markdownString);
        },
        //PROMISE: this is temporary until SSL certificates become viable for the project
        unsecuredCopyToClipboard(text) {
            const falseClipboard = document.createElement("textarea");
            falseClipboard.value = text;
            document.body.appendChild(falseClipboard);
            falseClipboard.focus({preventScroll:true});
            falseClipboard.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Unable to copy to clipboard', err);
            }
            document.body.removeChild(falseClipboard);
        }
    }
};
</script>

<style scoped>
.message {
    display: flex;
    flex-direction: column;
    width: 90%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid;
    border-radius: 10px;
    color: white;
    font-size: 12pt;
    font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    overflow: none;
    /*white-space: pre-wrap;*/
}

.message ::v-deep {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
}

.message.user {
    align-self: flex-end;
    background-color: #2e1d2e;
    color: #ff60ff;
    border-bottom-right-radius: 0;
}

.message.assistant {
    align-self: flex-start;
    background-color: #0e2324;
    color: #57f9ff;
    border-bottom-left-radius: 0;
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
    color: white;
}

:deep(.copy-button) {
    display: flex;
    padding: 5px;
    background: none;
    border-width: 1px;
    border-radius: 10px;
    border-color: #00000088;
    color: white;
    cursor: copy;
    font-family: roboto mono, monospace;
    font-size: 10pt;
    text-align: center;
    padding: 5px;
}

:deep(.codebody) {
    background-color: #00000088;
    overflow-y: auto;
    color: white;
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
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

.message {
  animation: slidein 0.5s ease;
  /* rest of your css */
}
</style>
  