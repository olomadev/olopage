import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { VueNodeViewRenderer } from "@tiptap/vue-3";

import CustomCodeBlock from '@/components/block-editor/CustomCodeBlock.vue';
export const CustomCodeBlockExtension = CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(CustomCodeBlock);
  },
});
