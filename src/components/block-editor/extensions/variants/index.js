import { Extension } from "@tiptap/core";
import { GetTopLevelNode } from "../../utils/pm-utils";

export const Variants = Extension.create({
  name: "Variants",
  addOptions() {
    return {
      types: [],
      defaultVariant: "default",
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          variant: {
            default: this.options.defaultVariant,

            parseHTML: (element) => element.dataset.variant,
            renderHTML: (attributes) => {
              if (attributes.variant === this.options.defaultVariant) {
                return {};
              }
              return {
                "data-variant": attributes.variant,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setVariant:
        (variant) =>
        ({ commands, view }) => {
          commands.updateAttributes(GetTopLevelNode(view).type.name, {
            variant: variant,
          });
          return true;
        },
      unsetVariant:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, "variant")
          );
        },
    };
  },
});
export default Variants;