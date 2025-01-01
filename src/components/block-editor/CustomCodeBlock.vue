<template>
  <NodeViewWrapper 
    class="hljs-copy-wrapper"
    :data-block-width="node.attrs.blockWidth"
  >
    <div class="hljs-copy-container">
      <button
        class="hljs-copy-button"
        :data-copied="copied ? 'true' : 'false'"
        @click="copyCode"
      >
        {{ copied ? 'Copied!' : '' }}
      </button>
    </div>
    <pre class="code-block-content" ref="codeBlock" data-node-view-content></pre>
  </NodeViewWrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { all, createLowlight } from 'lowlight'
const lowlight = createLowlight(all)

export default {
  props: nodeViewProps,
  components: {
    NodeViewWrapper
  },
  data() {
    return {
      copied: false,
    };
  },
  watch: {
    node: {
      handler() {
        this.renderCode();
      },
      deep: true,
    },
  },
  mounted() {
    this.renderCode();
  },
  methods: {
    renderCode() {
      const codeBlock = this.$refs.codeBlock;
      if (!codeBlock) {
        console.warn('Code block element is not available');
        return;
      }
      const content = this.node.textContent || '';
      let { language } = this.node.attrs;
      //
      // Ensure the language is a valid string
      if (typeof language !== 'string' || language.trim() === '') {
        console.warn('Invalid or missing language. Defaulting to "plaintext".');
        language = 'plaintext';
      }
      if (content.trim() === '') {
        console.warn('No content to highlight');
        return;
      }
      try {
        // Perform syntax highlighting only if there is content and valid language
        codeBlock.innerHTML = lowlight.highlight(language, content).value;
      } catch (error) {
        console.error('Error highlighting code:', error);
      }
    },
    copyCode() {
      const text = this.node.textContent;
      if (!navigator.clipboard) {
        console.warn('Clipboard API not supported. Using fallback.');
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            this.copied = true;
          }
        } catch (err) {
          console.log('Fallback: Unable to copy.', err);
        }
        document.body.removeChild(textarea);
      } else {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            this.copied = true;
            setTimeout(() => {
              this.copied = false;
            }, 2000);
          })
          .catch((err) => {
            console.log('Failed to copy code:', err);
          });
      }
    },
  },
  components: {
    NodeViewWrapper,
  },
};
</script>

<style scoped>
/* Apply your provided CSS here */

.hljs-copy-wrapper {
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}
.hljs-copy-container {
  --hljs-theme-padding: 16px;
  position: absolute;
  top: 0;
  right: 0;
  transition: transform 200ms ease-out;
}
.hljs-copy-button {
  position: relative;
  margin-top: 10px;
  margin-right: 10px;
  width: calc(16px + var(--hljs-theme-padding));
  height: calc(16px + var(--hljs-theme-padding));
  font-size: 0.8125rem;
  text-indent: -9999px; /* Hide the inner text */
  color: gray;
  border-radius: 0.25rem;
  border: 1px solid;
  border-color: color-mix(in srgb, gray, transparent 30%);
  background-color: var(--hljs-theme-background);
  transition: background-color 200ms ease;
  overflow: hidden;
}
.hljs-copy-button:not([data-copied="true"])::before {
  content: "";
  width: 1rem;
  height: 1rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: currentColor;
  mask: url('data:image/svg+xml;utf-8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H18C18.2652 21 18.5196 20.8946 18.7071 20.7071C18.8946 20.5196 19 20.2652 19 20V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V20C21 20.7957 20.6839 21.5587 20.1213 22.1213C19.5587 22.6839 18.7957 23 18 23H6C5.20435 23 4.44129 22.6839 3.87868 22.1213C3.31607 21.5587 3 20.7957 3 20V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3V5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5V3ZM15 3H9V5H15V3Z" fill="black"/></svg>');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center center;
}
.hljs-copy-button:hover {
  background-color: color-mix(in srgb, gray, transparent 90%);
  border-color: #a8a8a8;
}
.hljs-copy-button:active {
  border-color: color-mix(in srgb, gray, transparent 60%);
  border-color: #a8a8a8;
}
.hljs-copy-button[data-copied="true"] {
  text-indent: 0px; /* Shows the inner text */
  width: auto;
  padding: 4px;
}
.hljs-copy-container[data-autohide="true"] {
  transform: translateX(calc(100% + 1.125em));
}
.hljs-copy-wrapper:focus-within .hljs-copy-container,
.hljs-copy-wrapper:hover .hljs-copy-container {
  transition: none;
  transform: translateX(0);
}
@media (prefers-reduced-motion) {
  .hljs-copy-button {
    transition: none;
  }
}
.hljs-copy-alert {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
