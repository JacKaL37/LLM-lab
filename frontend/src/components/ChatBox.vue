<!-- this bot helped me build this bot! autopoetic-->

<template>

  <div class="chatbox" @input="userHasInteracted = true;">

    <div class="top-panel" :disabled="isSending" :style="{ zIndex: 10 }"> 
      <div class="top-panel-left">
        <button :title="showControlPanel ? 'hide panel':'show panel'" 
          @click="showControlPanel = !showControlPanel; this.scrollCheck()" class="clear-button">
          {{showControlPanel ? "🔼" : "🔽"}}
        </button>
      </div>
      <div class="top-panel-mid">
          <input title="input valid user id" class="idInput" v-model="user_id" placeholder="user id" @input="storeID" :disabled="isSending" label="id"
                :style="{ color: validID ? '#FF00FF' : '#FFFFFF'}" />
          
          <select title="select a conversation prompt set" v-model="prompts_id" v-if="isDevID">
            <option v-for="key in this.prompt_options" :key="key" :value="key">
              {{ key }}
            </option>
          </select>
          
      </div>
      <div class="top-panel-right"> 
        <button title="previous chat" @click="prev_chat" class="clear-button" :disabled="prevDisabled">⬅️</button>
        <span title="current chat id">{{conversation_index + 1}}/{{conversation_histories.length}}</span>
        <button :title="conversation_index<conversation_histories.length-1 ? 'next chat' : 'new chat'" 
          @click="next_chat" class="clear-button"  :disabled="nextDisabled">
          {{conversation_index<conversation_histories.length-1 ? "➡️" : "🆕"}}
        </button>
      </div>
    </div>

    <Transition name="slide-down" :style="{ zIndex: 9}">
      <div class="top-panel" v-show="showControlPanel && validID">
        <div class="top-panel-left">
          <button :title="playAudio ? 'mute sound' : 'unmute sound'"
            @click="playAudio = !playAudio; setupAudio();" class="clear-button">
            {{playAudio ? "🔊" : "🔇"}}
          </button>
        </div>
        <div class="top-panel-mid">
          <button title="reset temperature" @click="temperature = 0.7" class="clear-button">🌡️</button>
          <input title="adjust temperature (0 = consistency, 1 = creativity)"
            style="width:70px;" type="range" class="tempInput" v-model.number="temperature" 
            min="0.0" max="1.0" step="0.05" placeholder="temperature" :disabled="isSending" />
          <span title="current temperature (0 = consistency, 1 = creativity)">{{parseFloat(temperature).toFixed(2)}}</span>
        </div>
        <div class="top-panel-right">
          <button title="download current conversation to text file" @click="downloadFile" class="clear-button" :disabled="isSending || emptyConversation">📥</button>
          <span style="width:12px"></span>
          <button title="delete ALL conversation histories" @click="clearHistories" class="clear-button" :disabled="isSending || !validID">💥</button>
          <span style="width:12px"></span>
          <button title="delete current conversation" @click="clearCurrentHistory" class="clear-button" :disabled="isSending || !validID || emptyConversation">❌</button>
        </div>
      </div>
    </Transition>
    
    <div class="chathistory" ref="chathistory">
      <ChatMessage v-for="(message, index) in message_list" :key="index" :message="message" />
    </div>
    

    <Transition name="slide-up">
      <div class="input-area" @input="userHasInteracted = true;" v-show="validID">
        <textarea title="type a message to interact with the ai"
          ref="textarea" v-model="userMessage" placeholder="send a message" :disabled="isSending || !validID" class="input"
          @keydown.enter.exact.prevent="onEnterKey" @input="onUserTextInput" />
        <button title="send message" @click="sendMessage" :disabled="isSending || userMessage==''" class="send-button">
          <img class="brainIcon" src="../assets/brain_slow.gif" v-show="!isSending" alt="brain">
          <img class="brainIcon" src="../assets/brain_quick.gif" v-show="isSending" alt="brain">
        </button>
      </div>
    </Transition>
    

    <div class="audio-area" @input="userHasInteracted = true;">
      <audio ref="audioElement"></audio>
    </div>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue';
import systemPrompts from './systemPrompts.js'

export default {
  components: {
    ChatMessage,
  },
  data() {
    return {
      userMessage: '',
      isSending: false,
      conversation_histories: [[]],
      currentAIresponse: { role: "ai", content: "" },
      audioContext: new (window.AudioContext || window.webkitAudioContext),
      streamDestination: null,
      osc: null,
      gainNode: null,
      showControlPanel: false,
      playAudio: false,


      user_id: "", 
      conversation_index: 0,
      use_case: ["COG366", "M01"],
      
      list_of_approved_IDs:[
        "805892463","805732331","806026611","805506406",
        "805902179","805884854","805857554","805966383",
        "806118360","805928198","806072370","805962358",
        "806188682","806016048","805967944","806049942",
        "805776424","805883559","805921933","806317615",
        "803024801","804578458","805746954","804239455",
        "805962379","806323698","806203592","805904307",
        "806181108","806069549","806203305","806022292",
        "805918958","testing","BIRD UP!!","8urIDhere"
      ],

      dev_IDs:[
        "testing","BIRD UP!!"
      ],

      prompts_id: "explore_CogModels",
      prompt_options: Object.keys(systemPrompts),
      system_prompts: systemPrompts,
      model: "gpt-4",
      temperature: 0.7,
      
      audioStarted: false,
      userInteracted: false,

      backendURL: process.env.VUE_APP_JONBOT_BACKEND_URL,
      api_token: process.env.VUE_APP_JONBOT_API_TOKEN,
      
      payload_schema: {
                "ids": {
                    "timestamp": Date.now(),
                    "uid": this.user_id,
                    "context route": this.use_case + [this.user_id],
                },
                "config": {
                  "model_name": "gpt-4",
                  "temperature": 0.7,
                },
                "system_prompts": [
                      "PERSONALITY: style and how to act",
                      "GOALS: what the system is trying to do",
                      "TASK: description",
                      "MORE PROMPTS: etcetcetc"
                ],
                "conversation_history": [
                    {role: "human", content: "hey, you're a pretty chill bot."},
                    {role: "ai",    content: "aw, shucks! 🙈"},
                    {role: "human", content: "i'm kinda into this cognitive science thing."},
                    {role: "ai",    content: "oh, rad! i can totally help with that."},
                    {role: "human", content: "so what's this computational modeling biz?"},
                    {role: "ai",    content: "it's like making a computer play pretend, but with cognitive processes."},
                    {role: "human", content: "and how's that work?"},
                    {role: "ai",    content: "you whip up a program that acts out the cognitive process you're curious about."},
                    {role: "human", content: "damn, that's cool!"},
                    {role: "ai",    content: "stoked you think so!"}
                ],
                "new_user_input": "gotta bounce now!",
            },
    };
  },
  computed: {
    message_list() {
      if (this.currentAIresponse.content != '') {
        return this.conversation_histories[this.conversation_index].concat({ role: "ai", content: this.currentAIresponse.content });
      }
      return this.conversation_histories[this.conversation_index];
    },
    nextDisabled(){
      let atListEnd = (this.conversation_index >= this.conversation_histories.length -1)
      let emptyList = (this.conversation_histories[this.conversation_index].length == 0)
      return (atListEnd && emptyList) || this.isSending
    },
    prevDisabled(){
      return this.conversation_index <= 0 || this.isSending
    },
    emptyConversation(){
      return this.conversation_histories[this.conversation_index].length == 0
    },
    validID(){
      return this.list_of_approved_IDs.includes(this.user_id)
    },
    isDevID(){
      return this.dev_IDs.includes(this.user_id)
    }
  },
  mounted() {

    // Setup socket

    this.setupSocket();

    // Listen for visibility change and setup socket again if page becomes visible.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.setupSocket(); // Try to reconnect
      }
    });

    this.conversation_histories = JSON.parse(localStorage.getItem('conversation_histories')) || [[]];
    this.conversation_index = JSON.parse(localStorage.getItem('conversation_index')) || 0;
    this.user_id = JSON.parse(localStorage.getItem('user_id')) || '';

    // sanity checks using min and max
    this.conversation_index = Math.max(0, Math.min(this.conversation_index, this.conversation_histories.length - 1));

    this.$nextTick(() => {
      const chatHistory = this.$refs.chathistory;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    });
    // Setup Musicality

    this.setupMusicality("Blues Scale");

    // Setup Audio

    this.setupAudio();

    this.expandTextarea();

  },
  methods: {
    async onEnterKey(event) {
      if (/Mobi|Android/i.test(navigator.userAgent) || event.shiftKey == true) {
        this.userMessage += "\n";
      } else {
        await this.sendMessage();
      }

    },
    async sendMessage() {
      //console.log("setting up audio context");
      this.setupAudio();

      let wasEmpty = this.isEmpty;
      

      if (this.userMessage.trim() !== '') {
        this.isSending = true;

        // Send the message over WebSocket
        await this.socket.send(JSON.stringify(this.get_payload()));

        this.conversation_histories[this.conversation_index].push({
          role: 'human',
          content: this.userMessage.trim(),
        });
        //localStorage.setItem('conversation_histories', JSON.stringify(this.conversation_histories));

        this.userMessage = "";
        this.scrollCheck();
        this.expandTextarea();

        if (wasEmpty) {
          localStorage.setItem('conversation_histories', JSON.stringify(this.conversation_histories));
          localStorage.setItem('conversation_index', JSON.stringify(this.conversation_index));
        }
      }
    },
    setupSocket() {
      // Connect to the WebSocket server on port 3001
      //this.socket = new WebSocket('ws://104.229.89.14:3001');
      if (!this.socket || this.socket.readyState == WebSocket.CLOSED){
        this.socket = new WebSocket("wss://" + this.backendURL + '/chat_stateless?token=' + this.api_token)
      }

      if(this.audioContext.isStopped){
        this.audioContext.resume();
      }

      // Listen for incoming messages and handle them
      this.socket.onmessage = (event) => {
        const JSONmsg = JSON.parse(event.data);
        console.log(JSONmsg);

        if (JSONmsg.type == "token") {
          //console.log("token received");
          this.currentAIresponse.content += JSONmsg.content;
          //console.log(this.currentAIresponse.content);
          if(this.playAudio){
            this.playTickSound();
          }
          //console.log("tick played")
          this.scrollCheck();
          //console.log("scroll checked")

        } else if (JSONmsg.type == "ai_response") {

          this.conversation_histories[this.conversation_index].push({ role: "ai", content: JSONmsg.content });
          localStorage.setItem('conversation_histories', JSON.stringify(this.conversation_histories));

          this.currentAIresponse.content = '';
          
          if(this.playAudio){
            this.playTickChord();
          }

          this.isSending = false;
          this.$nextTick(() => {
            this.$refs.textarea.focus();
          });
        }
        //console.log("message exited")
        //console.log(this.socket.bufferedAmount);
      };
    },
    get_payload(){
      let payload = {
                "ids": {
                    "timestamp": Date.now(),
                    "uid": this.user_id,
                    "use_case": this.use_case,
                },
                "config": {
                  "model_name": this.model,
                  "temperature": this.temperature,
                },
                "system_prompts": this.system_prompts[this.prompts_id],
                "conversation_history": this.conversation_histories[this.conversation_index],
                "new_user_input": this.userMessage.trim(),
            }
      return payload
    },
    get_context_route(){
      return  this.use_case.join("-") + "-" + this.user_id
    },
    next_chat(){
      console.log(this.conversation_histories[this.conversation_index])
      if(this.conversation_histories[this.conversation_index].length != 0){
        if(this.conversation_index < this.conversation_histories.length - 1){
          this.conversation_index += 1
          console.log("moving to existing conversation: " + this.conversation_index)
          localStorage.setItem('conversation_index', JSON.stringify(this.conversation_index));
        } else {
          this.conversation_histories.push([])
          this.conversation_index += 1
          console.log("creating new conversation at: " + this.conversation_index)
        }
      }
    },
    prev_chat(){
      if(this.conversation_index > 0){
        this.conversation_index -= 1
        localStorage.setItem('conversation_index', JSON.stringify(this.conversation_index));
      }
    },
    clearHistories() {
      if(confirm("Are you sure you want to clear your histories?")){
        if(confirm("Seriously, this permanently deletes all your chats.")){
          localStorage.removeItem('conversation_histories');
          localStorage.removeItem('conversation_index')
          this.conversation_histories = [[]];
          this.conversation_index = 0;
        }
      }
    },
    clearCurrentHistory() {
      let isEmpty = this.conversation_histories[this.conversation_index].length == 0
      if(isEmpty){
        return
      }
      if(confirm("Delete the current conversation?")){
        this.conversation_histories.splice(this.conversation_index, 1);
        if (this.conversation_histories.length === 0) {
          // If we've deleted the last conversation, reset everything
          this.conversation_histories = [[]];
          this.conversation_index = 0;
        } else {
          this.conversation_index = Math.max(0, this.conversation_index - 1);
        }
        localStorage.setItem('conversation_histories', JSON.stringify(this.conversation_histories));
        localStorage.setItem('conversation_index', JSON.stringify(this.conversation_index));
      }
    },
    storeID(){
      localStorage.setItem('user_id', JSON.stringify(this.user_id));
    },
    downloadFile() {
      if(this.conversation_histories[this.conversation_index].length == 0){
        return
      }

      let formattedConversation = this.conversation_histories[this.conversation_index].map(message => {
        return `${message.role === 'human' ? 'human🧠' : 'ai🔮'}:\n${message.content}\n`;
      }).join('\n');

      let blob = new Blob([formattedConversation], {type: "text/plain;charset=utf-8"});
      let url = URL.createObjectURL(blob);

      let filename = 'conversation_' + this.get_context_route() + "-" + this.prompts_id + "-" + this.conversation_index
      let extension = ".txt" 
      let a = document.createElement('a');

      this.saveToServer(formattedConversation, filename, extension, this.use_case.concat([this.user_id]))

      a.href = url;
      a.download = filename + extension;
      a.click();
    },
    async saveToServer(blob, filename, extension, path){
      console.log(blob, filename, extension, path)
      let xhr = new XMLHttpRequest();
      let url = "https://" + this.backendURL + "/file_dump";

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log('File sent to server');
        }
      };
      let data = JSON.stringify({
        "blob": blob,
        "filename": filename,
        "extension": extension,
        "context_path": path
      });

      xhr.send(data);
    },
    scrollCheck() {
      // this gets the .chathistory div
      const chatHistory = this.$refs.chathistory;

      const threshold = 50;

      //check if chathistory exists before we do anything
      if (chatHistory) {
        // check if .chathistory scroll was already at the bottom
        if (chatHistory.scrollTop + chatHistory.clientHeight + threshold >= chatHistory.scrollHeight) {
          // if it was, wait for dom to update then scroll to new bottom 
          this.$nextTick(() => {
            chatHistory.scrollTop = chatHistory.scrollHeight;
          });
        }
      }


      // if chat wasn't already at the bottom, don't do anything!
    },
    expandTextarea() {
      this.$nextTick(() => {
        this.$refs.textarea.style.height = 'auto';
        const scrollHeight = this.$refs.textarea.scrollHeight;
        const verticalPadding = 2 * 10; // 2 * padding-top
        this.$refs.textarea.style.height = `${scrollHeight - verticalPadding}px`;
      })
    },
    






    setupAudio() {

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)
      // Setup audio
      this.streamDestination = this.audioContext.createMediaStreamDestination()

      this.$refs.audioElement.srcObject = this.streamDestination.stream

      try {
        if (this.userHasInteracted) {
          this.$refs.audioElement.play();
        }
      } catch (err) {
        // handle error here 
        console.log('AudioContext tried to start before user interaction.');
      }


    },
    onUserTextInput(){
      this.expandTextarea(); 
      this.scrollCheck();
      ///if (this.audioContext.state === 'running' && this.userHasInteracted) {
      ///  this.playTickSound();
      ///} 
    },
    setupMusicality(patternName) {
      this.scalePatterns = {
        "Constant": [1],
        "Pentatonic": [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3],
        "Blues Scale": [1, 6 / 5, 4 / 3, 7 / 5, 3 / 2, 8 / 5],
        "Minor Pentatonic": [1, 6 / 5, 4 / 3, 3 / 2, 8 / 5],
        "Major Scale": [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8],
        "Minor Scale": [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5],
        "Whole Tone": [1, 9 / 8, 5 / 4, 45 / 32, 3 / 2, 8 / 5],

        "Dorian Mode": [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5],
        "Mixolydian Mode": [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 16 / 9],
        "Lydian Mode": [1, 9 / 8, 5 / 4, 45 / 32, 3 / 2, 5 / 3, 15 / 8],
        "Phrygian Mode": [1, 16 / 15, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5],

        "Locrian Mode": [1, 16 / 15, 6 / 5, 64 / 45, 8 / 5, 16 / 9, 32 / 15],
        "Maqam Bayati": [1, 3 / 4, 3 / 2, 2, 3, 4],
        "Maqam Hijaz": [1, 5 / 4, 3 / 2, 7 / 4, 2],
        "Maqam Rast": [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 7 / 2, 2],
        "Maqam Sikah": [1, 3 / 2, 2, 3, 4],
        "Octotonic Scale": [1, 9 / 8, 6 / 5, 3 / 2, 8 / 5, 5 / 3, 7 / 4, 15 / 8],
        "Harmonic Minor Scale": [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 15 / 8],
        "Melodic Minor Scale (Asc)": [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 5 / 3, 15 / 8],
        "Melodic Minor Scale (Desc)": [1, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5]
      }

      this.baseNote = 440 //A4

      this.notesInScale = 6

      this.scaleNotes = this.generateScale(this.notesInScale, this.baseNote, this.scalePatterns[patternName]);
      //console.log(this.scaleNotes)

      this.currentNotePointer = 0;
    },
    async playTickSound() {

      //attack, sustain, decay, release, wave-type
      this.osc = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      //set types
      this.osc.type = "sine"  //"sine", "sawtooth", "square", "triangle", "custom"

      //brownian pentatonic wandering
      this.currentNotePointer += parseInt(Math.floor((Math.random() * 5) - 2));
      this.currentNotePointer = (this.currentNotePointer + this.scaleNotes.length) % this.scaleNotes.length;
      this.osc.frequency.value = this.scaleNotes[this.currentNotePointer]

      //connections
      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.streamDestination);

      // Gain value starts from 0
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

      // Gain value increases to 0.1 over 0.01 seconds (fade in)
      this.gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.02);

      this.osc.start(this.audioContext.currentTime);

      // Gain value decreases to 0 over 0.01 seconds (fade out)
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.04);

      this.osc.stop(this.audioContext.currentTime + 0.2);

    },
    async playTickChord() {
      let osc1 = this.audioContext.createOscillator();
      let osc2 = this.audioContext.createOscillator();
      let osc3 = this.audioContext.createOscillator();
      let osc4 = this.audioContext.createOscillator();
      let gainNode = this.audioContext.createGain();

      osc1.type = "sine"
      osc2.type = "sine"
      osc3.type = "sine"
      osc4.type = "sine"

      osc1.frequency.value = this.scaleNotes[0] / 2
      osc2.frequency.value = this.scaleNotes[0] / 4
      osc3.frequency.value = this.scaleNotes[0] / 8
      osc4.frequency.value = this.scaleNotes[0] / 16

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      osc3.connect(gainNode);
      osc4.connect(gainNode);
      gainNode.connect(this.streamDestination);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

      // Gain value increases to 0.1 over 0.01 seconds (fade in)
      gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);

      osc1.start(this.audioContext.currentTime);
      osc2.start(this.audioContext.currentTime);
      osc3.start(this.audioContext.currentTime);
      osc4.start(this.audioContext.currentTime);

      // Gain value decreases to 0 over 0.01 seconds (fade out)
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

      osc1.stop(this.audioContext.currentTime + 0.4);
      osc2.stop(this.audioContext.currentTime + 0.4);
      osc3.stop(this.audioContext.currentTime + 0.4);
      osc4.stop(this.audioContext.currentTime + 0.4);
    },
    generateScale(size, root, ratios) {
      //size, rootNote, scale, ratios, iteration_patterns (what directions and how do they play out)
      // adding in musicality: 3-3-3-2 random up and down would be a musical pattern
      // adding in chord progression: changing base frequency every few notes 1 4 5 1 
      // look for two new-lines: next paragraph is next chord
      // could generate all possible notes ahead of time
      // every N notes, drop a bass chord in, or add lots of sustain, 
      // switch to monotone for code!!

      //let ratios =  [1, 9/8, 5/4, 45/32, 3/2, 8/5]; // pentatonic scale
      let frequencies = []; // array to store our frequencies

      for (let i = 0; i < size; i++) {
        let octave = Math.floor(i / 5);
        let note = i % 5;

        frequencies[i] = parseInt(root * Math.pow(2, octave) * ratios[note]);
      }

      return frequencies;
    }
  },
};
</script>

<style scoped>

* {
  --foreground-color: #3a0057;
  --base-color: #120025;
  --popout-color: #7631b6b4;
  --hot-aqua: #57f9ff66;
  --hot-indigo: #6F00FD;
  --hot-fuscia: #FF00FF;
  --hot-fuscia-faded: #FF00FF88;
  --hot-cerise: #FF00A8;
  /*
  --button-color: linear-gradient(.48turn, var(--popout-color) 0%, var(--foreground-color) 80%, var(--base-color) 100%);
  --button-focus-color: linear-gradient(.98turn, var(--popout-color) 0%, var(--foreground-color) 80%, var(--base-color) 100%);
  */
  --button-color: radial-gradient(var(--base-color),var(--popout-color));
  --button-focus-color: radial-gradient(var(--popout-color),var(--base-color));
}
.chatbox {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  padding: 0px;
  border-radius: 10px;
  background-color: var(--base-color); /*#202020;*/
  font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

@media all and (display-mode: browser) {
/* styles for when your app is viewed in a browser */
.chatbox {
height: calc(100% - 60px); /* adjust this value as needed */
}
}

@media all and (display-mode: standalone) {
/* styles for when your app is installed on the home screen */
.chatbox {
height: 100%;
}
}

.top-panel, .top-panel-left, .top-panel-right, .top-panel-mid{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  color: white;
  font-family: monospace;
  background-color: var(--foreground-color);
}

.top-panel input, .top-panel select{
  background-color: var(--base-color);
  border: none;
  border-radius: 20px;
  text-align: center;
  color: #57f9ff;
  height: 80%;
  font-size: 16px;
}

.top-panel select{
  width: 100px;
  font-size: 16px;
  font-family: monospace;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  text-align: center;
  height: 80%;
}

.brainIcon{
  width: 50vw; /* adjust this value as needed */
  min-width: 50px; /* adjust this value as needed */
  max-width: 200px; /* adjust this value as needed */
  margin: 4px;
  color: #57f9ff;
  opacity: 1.0;
}



.idInput{
  width: 100px;
  font-family: monospace;
  font-weight: bold;
}

.tempInput{
  width: 50px;
  font-family: monospace;
}

.top-panel button, .top-panel span{
  width: 32px; /* adjust as needed */
  height: 32px; /* adjust as needed */
  border-radius: 20%; /* this makes it round */
  padding: 0; /* removes extra padding */
  display: flex; /* centers the emoji */
  align-items: center; /* centers the emoji */
  justify-content: center; /* centers the emoji */
  font-size: 20px; /* adjust as needed */
  line-height: 1; /* adjust as needed */
  vertical-align: middle; /* centers the emoji */
  margin: 2px;
  color: #FFFFFFaa;
}

.top-panel button, .send-button{
  background: var(--button-color);
  border-radius: 10px;
}

.top-panel button:active, .send-button:active{
  background: var(--button-focus-color);
}


.top-panel button:disabled{
  opacity: 0.3;
}

.top-panel span{
  font-size: 10pt;
  width: 30px;
  align-self: center;
}

.chathistory {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  width: 100%;
  min-height: 250px;
  overflow: auto;
}

.chathistory:disabled{
  opacity: 0.3;
}

.chathistory ChatMessage:disabled{
  opacity: 0.3;
}


::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: var(--foreground-color);
  
}

::-webkit-scrollbar-thumb {
  /* background-color: rgba(125, 125, 125, 0.7); */
  background-color: var(--hot-indigo);
  border-radius: 4px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

.input-area {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  background-color: var(--foreground-color);
}

.input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  resize: none;
  outline: none;
  overflow: auto;
  background-color: var(--foreground-color);
  border-radius: 20px;
  font-size: 12pt;
  font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  color: white;
  max-height: 300px;
  width: 50px;
  padding: 16px;
}


.clear-button{
  border: none;
  color: white;
  background-color: var(--foreground-color);
}

.send-button {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  width: 70px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 30px;
  justify-content: center;
  align-items: center;
}



.input:disabled{
  opacity: 0.5
}

.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.37s cubic-bezier(0.3, 0.2, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to{
  transform: translateY(-100%);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}



</style>