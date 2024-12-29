<template>
  <div class="blockeditor">
    <bubble-menu
      v-if="editor && tableRowTools"
      :editor="editor"
      pluginKey="tableRowMenu"
      :should-show="tableIsActive"
      :tippy-options="{
        placement: 'left',
        getReferenceClientRect: getTableRowMenuCoords,
      }"
    >
      <menu-item>
        <menu-button
          title="Row tools"
          class="rounded-full text-slate-400 hover:text-slate-800"
          :content="moreIconRound"
        />

        <template #dropdown>
          <menu-dropdown-button

            v-for="tool in tableRowTools"
            v-html="tool.icon + ' ' + tool.title"
            :key="tool.title"
            :label="tool.title"
            @click.prevent="tool.command(editor)"
          />
        </template>
      </menu-item>
    </bubble-menu>

    <bubble-menu
      v-if="editor && tableColumnTools"
      :editor="editor"
      pluginKey="tableColumnMenu"
      :should-show="tableIsActive"
      :tippy-options="{
        placement: 'bottom',
        getReferenceClientRect: getTableColumnMenuCoords,
      }"
    >
      <menu-item>
        <menu-button
          title="Column tools"
          :content="moreIconRound"
          class="rounded-full text-slate-400 hover:text-slate-800"
        />
        <template #dropdown>
          <menu-dropdown-button
            v-for="tool in tableColumnTools"
            :content="tool.icon + ' ' + tool.title"
            :key="tool.title"
            :label="tool.title"
            @click.prevent="tool.command(editor)"
          />
        </template>
      </menu-item>
    </bubble-menu>

    <bubble-menu
      pluginKey="mainMenu"
      @dragend="endDragging($event)"
      :draggable="dragging"
      :should-show="shouldShowMainToolbar"
      v-if="editor"
      class="text-sm bg-white max-w-screen flex divide-x max-w-full divide-slate-400 flex-row border-slate-400 md:rounded border-t md:border"
      :editor="editor"
      :class="{
        'mouse:pointer-events-none mouse:opacity-0': isTyping,
      }"
      :tippy-options="{
        maxWidth: 'none',
        placement: 'top-start',
        getReferenceClientRect: getMenuCoords,
        onCreate: (instance) =>
          instance.popper.classList.add(
            'max-md:!sticky',
            'max-md:!bottom-0',
            'max-md:!top-auto',
            'max-md:!transform-none'
          ),
      }"
    >
      <div class="flex flex-row">
        <button
          @click.prevent
          @mousedown="startDragging($event)"
          @mouseup="
            draggedNodePosition = false;
            dragging = false;
          "
          class="hidden md:block ml-1 my-2 hover:bg-slate-100 rounded"
          :class="{
            'cursor-grab': !dragging,
            'cursor-grabbing mr-1': dragging,
          }"
          aria-label="Drag"
          data-tooltip="Drag"
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            class="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              d="M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"
            ></path>
          </svg>
        </button>

        <div
          class="py-2 md:py-2 group relative"
          v-if="!dragging && currentBlockTool"
        >
          <menu-item>
            <menu-button
              @click.prevent
              :title="currentBlockTool?.name"
              :content="currentBlockTool?.icon"
              :class="
                currentBlockTool?.canBeConverted &&
                'group-focus-within:bg-slate-600 !cursor-pointer group-focus-within:text-white hover:bg-slate-50'
              "
            />
            <template v-if="currentBlockTool?.canBeConverted" #dropdown>
              <div
                class="p-3 uppercase text-gray-600 text-xs pb-1 tracking-wide"
              >
                Transform to
              </div>
              <menu-dropdown-button
                v-for="tool in allBlockTools.filter(
                  (tool) => tool.convertCommand
                )"
                :content="tool.icon + ' ' + tool.title"
                :key="tool.title"
                :label="tool.title"
                @click.prevent="tool.convertCommand(editor)"
                activeClass="hidden"
                :active="tool.isActiveTest(editor)"
              />
            </template>
          </menu-item>
        </div>

        <div class="pr-2 flex gap-1 flex-col " v-if="!dragging">
          <button
            @click.prevent="moveNode('UP')"
            :disabled="!canMoveNodeUp()"
            data-tooltip="Move up"
            class="mt-1 md:mt-2"
          >
            <svg
              width="24"
              height="24"
              class="pointer-events-none w-5 h-5 md:w-6 md:h-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z"
              ></path>
            </svg>
          </button>
          <button
            @click.prevent="moveNode('DOWN')"
            :disabled="!canMoveNodeDown()"
            data-tooltip="Move down"
            class="-mt-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="pointer-events-none -mt-2 w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M17.5 11.6 12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        class="flex gap-1 items-center hide-empty flex-row p-1 md:p-2"
        v-if="!dragging"
      >
        <menu-item
          v-for="(alignmentToolGroup, key) in activeAlignmentTools"
          :key="key"
        >
          <menu-button
            @click.prevent
            :title="
              alignmentToolGroup.find((tool) =>
                tool.isActiveTest(editor, topLevelNodeType)
              )?.title
            "
            :content="
              alignmentToolGroup.find((tool) =>
                tool.isActiveTest(editor, topLevelNodeType)
              )?.icon
            "
          />
          <template #dropdown>
            <menu-dropdown-button
              v-for="tool in alignmentToolGroup"
              :key="tool.title"
              :content="tool.icon + ' ' + tool.title"
              :label="tool.title"
              @click.prevent="tool.command(editor)"
              :active="tool.isActiveTest(editor, topLevelNodeType)"
            />
          </template>
        </menu-item>
      </div>

      <div
        v-if="!dragging && currentBlockTool?.tools?.length"
        class="gap-1 flex flex-row items-center p-1 md:p-2"
      >
        <menu-button
          v-for="tool in currentBlockTool?.tools"
          :key="tool.name"
          :content="tool.icon"
          :label="tool.title"
          :activeClass="tool.isActiveClass"
          @click.prevent="tool.command.call(0, editor)"
          :disabled="tool.isDisabledTest?.call(0, editor)"
          :active="tool.isActiveTest?.call(0, editor)"
        ></menu-button>
      </div>

      <div
        v-if="currentBlockTool?.hasInlineTools && !dragging"
        class="p-1 gap-0.5 md:p-2 md:gap-1 flex relative flex-row items-center"
      >
        <menu-item
          align="right"
          :key="tool.title"
          v-for="tool in allInlineTools"
        >
          <menu-button
            :content="tool.icon"
            :label="tool.title"
            :activeClass="tool.isActiveClass"
            @click.prevent="tool.command(editor)"
            :active="tool.isActiveTest(editor)"
          ></menu-button>
          <template #dropdown>
            <menu-dropdown-button
              v-for="tool in tool.tools"
              :key="tool.name"
              :content="tool.icon + ' ' + tool.title"
              @click.prevent="tool.command(editor)"
              :active="tool.isActiveTest(editor)"
            />
          </template>
        </menu-item>
      </div>

      <div
        v-if="editor && editor.can().deleteNode(topLevelNodeType) && !dragging"
        class="p-1 gap-0.5 md:p-2 md:gap-1 flex group flex-row items-center relative"
      >
        <menu-item align="right">
          <menu-button
            @click.prevent
            :content="createIcon"
            label="Create New"
          ></menu-button>
          <template #dropdown>
            <menu-dropdown-button
              ref="insertHeader"
              :content="headerIcon + 'Heading'"
              label="Heading"
              @click="editor.commands.setHeading({ level: 1 })"
            />
            <menu-dropdown-button
              ref="insertList"
              :content="listIcon + 'List'"
              label="List"
              @click="editor.chain().focus().toggleBulletList().run()"
            />
            <menu-dropdown-button
              ref="insertBlockquote"
              :content="blockquoteIcon + 'Blockquote'"
              label="Blockquote"
              @click="editor.chain().focus().toggleBlockquote().run()"
            />
            <menu-dropdown-button
              ref="insertCode"
              :content="codeLowLightIcon + 'Code Block'"
              label="Code Block"
              @click="editor.chain().focus().setCodeBlock().run()"
            />
            <menu-dropdown-button
              ref="insertHorizontalRule"
              :content="horizontalRule + 'Horizontal Rule'"
              label="Horizontal Rule"
              @click="editor.chain().focus().setHorizontalRule().run()"
            />
            <menu-dropdown-button
              ref="insertTable"
              :content="tableIcon + 'Table'"
              label="Table"
              @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
            />
            <menu-dropdown-button
              ref="uploadImage"
              :content="uploadImageIcon + 'Upload Image'"
              label="Upload Image"
              @click="triggerFileUpload"
            />            
            <menu-dropdown-button
              ref="insertImage"
              :content="imageIcon + 'Add Link Image'"
              label="Add Link Image"
              @click="addLinkImage"
            />
          </template>
        </menu-item>
      </div>
      
      <div
        v-if="editor && editor.can().deleteNode(topLevelNodeType) && !dragging"
        class="p-1 gap-0.5 md:p-2 md:gap-1 flex group flex-row items-center relative"
      >
        <menu-item align="right">
          <menu-button
            ref="deleteButton"
            :content="deleteIcon"
            label="Delete"
            @click.prevent="deleteNode(topLevelNodeType)"
          ></menu-button>
        </menu-item>
      </div>
    </bubble-menu>

    <editor-content
      :class="editorClass ?? 'prose'"
      @keydown="isTyping = true"
      @keyup.esc="isTyping = false"
      ref="editor"
      :editor="editor"
    />
    <input type="file" id="file-upload-input" ref="fileInput" @change="onFileChange" accept="image/png,image/jpg,image/jpeg,image/gif,image/webp" hidden  />
  </div>
</template>

<script>
import MenuButton from "@/components/block-editor/MenuButton.vue"
import MenuItem from "@/components//block-editor/MenuItem.vue"
import MenuDropdownButton from "@/components//block-editor/MenuDropdownButton.vue"
import { BubbleMenu, Editor, EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TextAlign from "@tiptap/extension-text-align"
import Blockquote from "@tiptap/extension-blockquote"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Highlight from "@tiptap/extension-highlight"
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from "@tiptap/extension-image"
import { Figure } from './extensions/figure'
import { CustomCodeBlockExtension } from './extensions/code-block';
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'
const lowlight = createLowlight(all)
import {
  DragNode,
  MoveNode,
  GetTopLevelBlockCoords,
  GetTableColumnCoords,
  GetTableRowCoords,
  GetTopLevelNode,
} from "./utils/pm-utils.js";
import { mergeArrays } from "./utils/utils";
import BlockWidth from "./extensions/block-width";
// import { Youtube } from "extensions/youtube";
import { TrailingNode } from "./extensions/trailing-node";
import { InsertBetween } from "./extensions/insert-between";
import Variants from "./extensions/variants";
import Commands from "./commands";
import suggestion from "./suggestion";
import defaultBlockTools from "./tools/block-tools";
import defaultInlineTools from "./tools/inline-tools";
import defaultAlignmentTools from "./tools/alignment-tools";
import { tableRowTools, tableColumnTools } from "./tools/table-tools";

export default {
  props: {
    modelValue: {},
    editable: {
      default: true,
    },
    placeholder: {
      type: String,
      default: "Type / to choose a block",
    },
    editorClass: {
      type: String,
    },
    mode: {
      type: String,
      default: "html",
    },
    extensions: {
      type: Array,
      default: () => [],
    },
    blockTools: {
      type: Array,
      default: () => [],
    },
    inlineTools: {
      type: Array,
      default: () => [],
    },
    alignmentTools: {
      type: Array,
      default: () => [],
    },
    blockWidthTypes: {
      type: Array,
      default: () => ["horizontalRule", "blockquote", "youtube"],
    },
    variantsTypes: {
      type: Array,
      default: () => [
        "paragraph",
        "heading",
        "horizontalRule",
        "blockquote",
        "list",
        // "youtube",
      ],
    },
  },
  components: {
    BubbleMenu,
    EditorContent,
    MenuButton,
    MenuItem,
    MenuDropdownButton,
  },
  data() {
    return {
      fileInput: null,
      dragging: false,
      draggedNodePosition: null,
      editor: null,
      allBlockTools: mergeArrays(defaultBlockTools(), this.blockTools),
      allInlineTools: mergeArrays(defaultInlineTools(), this.inlineTools),
      allAlignmentTools: this.alignmentTools.length
        ? this.alignmentTools
        : defaultAlignmentTools(),
      tableRowTools: tableRowTools(),
      tableColumnTools: tableColumnTools(),
      topLevelNodeType: null,
      currentBlockTool: null,
      isTyping: false,
      showMainToolbar: false,
      moreIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/></svg>',
      deleteIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>',
      createIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>',
      headerIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" focusable="false"><path d="M6.2 5.2v13.4l5.8-4.8 5.8 4.8V5.2z"></path></svg>',
      listIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke-width="0" stroke="currentColor" fill="currentColor"  focusable="false"><path d="M4 4v1.5h16V4H4zm8 8.5h8V11h-8v1.5zM4 20h16v-1.5H4V20zm4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"></path></svg>',
      blockquoteIcon: 
        '<svg class="w-5 h-5 md:w-6 md:h-6" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" focusable="false"><path d="M13 6v6h5.2v4c0 .8-.2 1.4-.5 1.7-.6.6-1.6.6-2.5.5h-.3v1.5h.5c1 0 2.3-.1 3.3-1 .6-.6 1-1.6 1-2.8V6H13zm-9 6h5.2v4c0 .8-.2 1.4-.5 1.7-.6.6-1.6.6-2.5.5h-.3v1.5h.5c1 0 2.3-.1 3.3-1 .6-.6 1-1.6 1-2.8V6H4v6z"></path></svg>',
      horizontalRule:
        '<svg class="w-5 h-5 md:w-6 md:h-6" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M20.2 7v4H3.8V7H2.2v9h1.6v-3.5h16.4V16h1.6V7z"></path></svg>',
      tableIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" focusable="false"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v3.5h-15V5c0-.3.2-.5.5-.5zm8 5.5h6.5v3.5H13V10zm-1.5 3.5h-7V10h7v3.5zm-7 5.5v-4h7v4.5H5c-.3 0-.5-.2-.5-.5zm14.5.5h-6V15h6.5v4c0 .3-.2.5-.5.5z"></path></svg>',
      codeLowLightIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>',
      imageIcon: 
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" /></svg>',
      uploadImageIcon:
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z" /></svg>',
      // youtubeIcon: 
      //   '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="24" height="24" version="1.1" viewBox="0 0 461.001 461.001"><path fill="currentColor" d="M365.257 67.393H95.744C42.866 67.393 0 110.259 0 163.137v134.728c0 52.878 42.866 95.744 95.744 95.744h269.513c52.878 0 95.744-42.866 95.744-95.744V163.137c0-52.878-42.866-95.744-95.744-95.744zm-64.751 169.663-126.06 60.123c-3.359 1.602-7.239-.847-7.239-4.568V168.607c0-3.774 3.982-6.22 7.348-4.514l126.06 63.881c3.748 1.899 3.683 7.274-.109 9.082z"/></svg>',
      moreIconRound:
        '<svg class="w-5 h-5 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
  },
  created: function () {
    window.addEventListener("mousemove", () => this.cancelTyping());
  },
  unmounted: function () {
    window.removeEventListener("mousemove", () => this.cancelTyping());
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          blockquote: false,
        }),
        Blockquote.extend({
          content: "paragraph",
        }),
        CustomCodeBlockExtension.configure({
          lowlight,
          defaultLanguage: 'javascript',
          // languageClassPrefix: 'language-',
        }),
        // CodeBlockLowlight.configure({
        //   lowlight,
        //   defaultLanguage: 'js',
        //   languageClassPrefix: 'language-',
        // }),
        TrailingNode,
        InsertBetween,
        Subscript,
        Superscript,
        Highlight,
        Figure,
        // Commands.configure({
        //   suggestion: suggestion(this.allBlockTools),
        // }),
        Link.configure({
          openOnClick: false,
        }),
        Placeholder.configure({
          placeholder: this.placeholder,
        }),
        BlockWidth.configure({
          types: this.blockWidthTypes,
        }),
        Variants.configure({
          types: this.variantsTypes,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow.extend({
          allowGapCursor: false,
        }),
        TableHeader.extend({
          content: "(inline|hardBreak?)*",
          isolating: false,
        }),
        TableCell.extend({
          content: "(inline|hardBreak?)*",
          isolating: false,
        }),
        Image.extend({
          addOptions() {
            return {
              ...this.parent?.(),
              inline: false,
              allowBase64: true,
            };
          }
        }),
        // Youtube.configure({
        //   inline: false,
        //   HTMLAttributes: {
        //     class: "aspect-video h-auto w-full",
        //   },
        // }),
        ...this.extensions,
      ],
      onUpdate: () => {
        this.updateToolbar();
        this.$emit(
          "update:modelValue",
          this.mode == "json"
            ? this.editor.getJSON().content
            : this.editor.getHTML()
        );
      },
      onSelectionUpdate: () => {
        this.updateToolbar();
        // this.nodeTree = GetNodeTree(this.editor.view);
      },
    });
    //
    // set default content
    //
    this.editor.commands.setContent(
      this.mode == "json"
        ? {
            type: "doc",
            content: this.modelValue,
          }
        : this.modelValue
    );
    this.editor.setEditable(this.editable);
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  watch: {
    topLevelNodeType() {
      this.currentBlockTool = this.getCurrentBlockTool();
    },
    editable() {
      this.editor.setEditable(this.editable);
    },
  },
  computed: {
    activeAlignmentTools() {
      if (this.topLevelNodeType) {
        return this.allAlignmentTools.filter((alignmentToolGroup) =>
          alignmentToolGroup.find((tool) =>
            tool.isActiveTest(this.editor, this.topLevelNodeType)
          )
        );
      } else {
        return null;
      }
    },
  },
  methods: {
    addLinkImage() {
      const url = window.prompt('URL')
      const caption = window.prompt('caption')
      if (this.isValidURL(url)) {
        this.editor
          .chain()
          .focus()
          .setFigure({ src: url, caption: caption })
          .run()
      } else {
        alert("Image url is not valid.");
      }
    },
    triggerFileUpload() {
      document.getElementById('file-upload-input').click();
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = await this.startImageProcess(reader.result);
          const caption = window.prompt('caption')
          this.editor
            .chain()
            .focus()
            .setFigure({ src: base64, caption: caption })
            .run();
        };
        reader.readAsDataURL(file);
      }
      event.target.value = ""; // Reset the input
    },
    async startImageProcess(base64Str) {
      const minImageSize = 300;
      const oldSize = this.calcImageSize(base64Str);
      if (oldSize > minImageSize) {
          const resized = await this.reduceImageFileSize(base64Str);
          return resized;
      } else {
          return base64Str;
      }
    },
    async reduceImageFileSize(base64Str, maxWidth = 800, maxHeight = 600) {
      let resizedBase64 = await new Promise((resolve) => {
          let img = new window.Image()
          img.src = base64Str
          img.onload = () => {
              let canvas = document.createElement('canvas')
              let width = img.width
              let height = img.height
              if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width
                    width = maxWidth
                }
              } else {
                if (height > maxHeight) {
                    width *= maxHeight / height
                    height = maxHeight
                }
              }
              canvas.width = width
              canvas.height = height
              let ctx = canvas.getContext('2d')
              ctx.drawImage(img, 0, 0, width, height)
              resolve(canvas.toDataURL()) // this will return base64 image results after resize
          }
      });
      return resizedBase64;
    },
    calcImageSize(image) {
      let y = 1;
      if (image.endsWith('==')) {
          y = 2
      }
      const x_size = (image.length * (3 / 4)) - y
      return Math.round(x_size / 1024)
    },
    cancelTyping() {
      this.$nextTick(() => (this.isTyping = false));
    },
    shouldShowMainToolbar() {
      return this.editable && this.editor.isActive() && this.modelValue;
    },
    updateToolbar() {
      this.topLevelNodeType = this.getTopLevelNodeType();
    },
    getCurrentBlockTool() {
      return this.allBlockTools.find(
        (tool) =>
          tool.name == this.topLevelNodeType ||
          tool.tools?.find((tool) => tool.name == this.topLevelNodeType)
      );
    },
    deleteNode(node) {
      this.editor.commands.deleteNode(node);
      this.$refs.deleteButton.$el.blur();
    },
    getMenuCoords() {
      return GetTopLevelBlockCoords(this.editor.view);
    },
    getTableRowMenuCoords() {
      return GetTableRowCoords(this.editor.view);
    },
    getTableColumnMenuCoords() {
      return GetTableColumnCoords(this.editor.view);
    },
    startDragging(event) {
      let coords = { left: event.clientX, top: event.clientY + 48 };
      this.draggedNodePosition = this.editor.view.posAtCoords(coords).pos;
      this.dragging = true;
    },
    endDragging(event) {
      let targetNodeFromCoords = this.editor.view.posAtCoords({
        left: event.clientX,
        top: event.clientY + 20,
      });
      if (targetNodeFromCoords) {
        DragNode({
          view: this.editor.view,
          state: this.editor.state,
          draggedNodePosition: this.draggedNodePosition,
          targetNodePosition: targetNodeFromCoords.pos,
        });
      }
      this.dragging = false;
      this.draggedNode = null;
    },
    tableIsActive() {
      return this.editable && this.getTopLevelNodeType() == "table";
    },
    moveNode(dir = "UP") {
      MoveNode({
        view: this.editor.view,
        dir: dir,
        currentResolved: this.editor.view.state.selection.$from,
      });
    },
    getTopLevelNodeType() {
      return GetTopLevelNode(this.editor.view)?.type.name;
    },
    canMoveNodeDown() {
      const selectionStart = this.editor.view.state.selection.$from;
      return selectionStart.index(0) < selectionStart.node(0).childCount - 1;
    },
    canMoveNodeUp() {
      const selectionStart = this.editor.view.state.selection.$from;
      return selectionStart.index(0) > 0;
    },
    isValidURL(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(str);
    }
  },
};
</script>

<style>
@import "style.css";
</style>
