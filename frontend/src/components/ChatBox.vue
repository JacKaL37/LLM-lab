<template>
  <div class="chatbox">
    <div class="chathistory" ref="chathistory">
      <ChatMessage v-for="(message, index) in message_list" :key="index" :message="message" />
    </div>

    <div class="input-area">
      <textarea ref="textarea" v-model="userMessage" placeholder="send a message" :disabled="isSending" class="input"
        @keydown.enter.exact.prevent="onEnterKey" @input="expandTextarea(); scrollCheck();" />
      <button @click="sendMessage" :disabled="isSending" class="send-button">Send</button>
    </div>

    <div class="audio-area">
      <audio ref="audioElement"></audio>
    </div>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue';
import * as Tone from 'tone';

export default {
  components: {
    ChatMessage,
  },
  data() {
    return {
      userMessage: '',
      isSending: false,
      conversation_history: [],
      currentAIresponse: { role: "ai", content: "" },
      audioContext: null,
      streamDestination: null,
      osc: null,
      gainNode: null,
      audioStarted: false,
      userInteracted: false,
    };
  },
  computed: {
    message_list() {
      if (this.currentAIresponse.content != '') {
        return this.conversation_history.concat({ role: "ai", content: this.currentAIresponse.content });
      }
      return this.conversation_history
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

    // Setup Musicality

    this.setupMusicality();

    // Setup Audio

    this.setupAudio();  
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
      if (this.audioContext.state != 'running'){
        console.log("setting up audio context");
        this.setupAudio();
      }
      const message = this.userMessage.trim();
      this.userMessage = '';

      if (message !== '') {
        this.scrollCheck();
        this.expandTextarea();

        this.isSending = true;

        this.conversation_history.push({
          role: 'human',
          content: message,
        });

        // Send the message over WebSocket
        this.socket.send(JSON.stringify({ message: message }));
      }
    },  
    scrollCheck() {
      // this gets the .chathistory div
      const chatHistory = this.$refs.chathistory;

      // check if .chathistory scroll was already at the bottom
      if (chatHistory.scrollTop + chatHistory.clientHeight === chatHistory.scrollHeight) {
        // if it was, wait for dom to update then scroll to new bottom 
        this.$nextTick(() => {
          chatHistory.scrollTop = chatHistory.scrollHeight;
        });
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
    setupSocket() {
      // Connect to the WebSocket server on port 3001
      this.socket = new WebSocket('ws://104.229.89.14:3001');

      // Listen for incoming messages and handle them
      this.socket.onmessage = (event) => {
        const JSONmsg = JSON.parse(event.data);

        if (JSONmsg.type == "token") {
          this.currentAIresponse.content += JSONmsg.content;
          this.playTickSound();
          this.scrollCheck();

        } else if (JSONmsg.type == "convo_init") {
          const convo_content = JSON.parse(JSONmsg.content);
          this.conversation_history = convo_content.slice(1);
          this.scrollCheck();

        } else if (JSONmsg.type == "aiResponse") {

          this.conversation_history.push({ role: "ai", content: JSONmsg.content });
          this.currentAIresponse.content = '';
          this.playTickSynth();

          this.isSending = false;
          this.$nextTick(() => {
            this.$refs.textarea.focus();
          });
        }
      };
    },
    setupAudio() {

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)
      // Setup audio
      this.streamDestination = this.audioContext.createMediaStreamDestination()

      this.$refs.audioElement.srcObject = this.streamDestination.stream

      try {
        this.$refs.audioElement.play();
      } catch (err) {
        // handle error here 
        console.log('AudioContext tried to start before user interaction.');
      } 
      

    },
    setupMusicality() {
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

      this.scaleNotes = this.generateScale(this.notesInScale, this.baseNote, this.scalePatterns["Blues Scale"]);
      console.log(this.scaleNotes)

      this.currentNotePointer = 0;
    },
    playTickSound() {
      //attack, sustain, decay, release, wave-type
      this.osc = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      //this.osc.type = "sine", "sawtooth", "square", "triangle", "custom"
      this.osc.type = "sine"

      //samples randomly from a list of possible numbers
      //this.osc.frequency.value = this.scaleNotes[Math.floor(Math.random() * this.scaleNotes.length)];

      //brownian pentatonic wandering
      this.currentNotePointer += parseInt(Math.floor((Math.random() * 5) - 2));
      this.currentNotePointer = (this.currentNotePointer + this.scaleNotes.length) % this.scaleNotes.length;

      this.osc.frequency.value = this.scaleNotes[this.currentNotePointer]
      //console.log("token freq.: " + this.scaleNotes[this.currentNotePointer] + "hz")

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
    playTickSynth() {
      Tone.setContext(this.audioContext) 
      const gain = new Tone.Gain(0.03).toDestination(); 
      //const synth = new Tone.Synth().connect(gain);
      const polySynth = new Tone.PolySynth().connect(gain);

      //brownian pentatonic wandering
      this.currentNotePointer += parseInt(Math.floor((Math.random() * 5) - 2));
      this.currentNotePointer = (this.currentNotePointer + this.scaleNotes.length) % this.scaleNotes.length;
      //let freq = this.scaleNotes[this.currentNotePointer];

      //synth.triggerAttackRelease(freq, "16n");
      const baseNote = this.scaleNotes[0]
      polySynth.triggerAttackRelease([baseNote / 16, baseNote / 4, baseNote / 8], "32n");
      //console.log("token freq.: " + freq + "hz");

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

.chatbox {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  height: 95vh;
  overflow: auto;
  padding: 0px;
  border-radius: 10px;
  background-color: #202020;
  font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
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

::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(125, 125, 125, 0.7);
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
  border-radius: 5px;
  background-color: #383838;
}

.input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  resize: none;
  outline: none;
  overflow: auto;
  background-color: #383838;
  border-radius: 20px;
  font-size: 12pt;
  font-family: Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  color: white;
  max-height: 300px;
  width: 50px;
  padding: 16px;
}

.send-button {
  align-self: stretch;
  width: 70px;
  border: none;
  color: white;
  background-color: #555555;
  border-radius: 5px;
  cursor: pointer;
}

.input:disabled,
.send-button:disabled {
  opacity: 0.1
}
</style>