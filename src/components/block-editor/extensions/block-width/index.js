import { Extension } from "@tiptap/core";
import { GetTopLevelNode } from "../../utils/pm-utils";

export const BlockWidth = Extension.create({
  name: "blockWidth",
  addOptions() {
    return {
      types: [],
      alignments: ["normal", "wide", "full", "sidebar"],
      defaultAlignment: "normal",
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          blockWidth: {
            default: this.options.defaultAlignment,
            parseHTML: (element) =>
              element.dataset.blockWidth || this.options.defaultAlignment,
            renderHTML: (attributes) => {
              if (attributes.blockWidth === this.options.defaultAlignment) {
                return {};
              }
              return { "data-block-width": attributes.blockWidth };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setBlockWidth: (alignment) => ({ commands, view }) => {
        if (!this.options.alignments.includes(alignment)) {
          return false;
        }
        commands.updateAttributes(GetTopLevelNode(view).type.name, {
          blockWidth: alignment,
        });
        return true;
      },
      unsetBlockWidth: () => ({ commands }) => {
        return this.options.types.every((type) =>
          commands.resetAttributes(type, "blockWidth")
        );
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      // 'Mod-Shift-l': () => this.editor.commands.setTextAlign('left'),
      // 'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
      // 'Mod-Shift-r': () => this.editor.commands.setTextAlign('right'),
      // 'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
    };
  },
});
export default BlockWidth;