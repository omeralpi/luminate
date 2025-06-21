import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { useState } from "react"

import { ContentEditable } from "@/components/ui/editor/editor-ui/content-editable"
import { ActionsPlugin } from "@/components/ui/editor/plugins/actions/actions-plugin"
import { CharacterLimitPlugin } from "@/components/ui/editor/plugins/actions/character-limit-plugin"
import { ClearEditorActionPlugin } from "@/components/ui/editor/plugins/actions/clear-editor-plugin"
import { CounterCharacterPlugin } from "@/components/ui/editor/plugins/actions/counter-character-plugin"
import { EditModeTogglePlugin } from "@/components/ui/editor/plugins/actions/edit-mode-toggle-plugin"
import { ImportExportPlugin } from "@/components/ui/editor/plugins/actions/import-export-plugin"
import { MarkdownTogglePlugin } from "@/components/ui/editor/plugins/actions/markdown-toggle-plugin"
import { MaxLengthPlugin } from "@/components/ui/editor/plugins/actions/max-length-plugin"
import { ShareContentPlugin } from "@/components/ui/editor/plugins/actions/share-content-plugin"
import { SpeechToTextPlugin } from "@/components/ui/editor/plugins/actions/speech-to-text-plugin"
import { TreeViewPlugin } from "@/components/ui/editor/plugins/actions/tree-view-plugin"
import { AutoLinkPlugin } from "@/components/ui/editor/plugins/auto-link-plugin"
import { AutocompletePlugin } from "@/components/ui/editor/plugins/autocomplete-plugin"
import { CodeActionMenuPlugin } from "@/components/ui/editor/plugins/code-action-menu-plugin"
import { CodeHighlightPlugin } from "@/components/ui/editor/plugins/code-highlight-plugin"
import { CollapsiblePlugin } from "@/components/ui/editor/plugins/collapsible-plugin"
import { ComponentPickerMenuPlugin } from "@/components/ui/editor/plugins/component-picker-menu-plugin"
import { ContextMenuPlugin } from "@/components/ui/editor/plugins/context-menu-plugin"
import { DragDropPastePlugin } from "@/components/ui/editor/plugins/drag-drop-paste-plugin"
import { DraggableBlockPlugin } from "@/components/ui/editor/plugins/draggable-block-plugin"
import { AutoEmbedPlugin } from "@/components/ui/editor/plugins/embeds/auto-embed-plugin"
import { FigmaPlugin } from "@/components/ui/editor/plugins/embeds/figma-plugin"
import { TwitterPlugin } from "@/components/ui/editor/plugins/embeds/twitter-plugin"
import { YouTubePlugin } from "@/components/ui/editor/plugins/embeds/youtube-plugin"
import { EmojiPickerPlugin } from "@/components/ui/editor/plugins/emoji-picker-plugin"
import { EmojisPlugin } from "@/components/ui/editor/plugins/emojis-plugin"
import { EquationsPlugin } from "@/components/ui/editor/plugins/equations-plugin"
import { ExcalidrawPlugin } from "@/components/ui/editor/plugins/excalidraw-plugin"
import { FloatingLinkEditorPlugin } from "@/components/ui/editor/plugins/floating-link-editor-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/components/ui/editor/plugins/floating-text-format-plugin"
import { ImagesPlugin } from "@/components/ui/editor/plugins/images-plugin"
import { InlineImagePlugin } from "@/components/ui/editor/plugins/inline-image-plugin"
import { KeywordsPlugin } from "@/components/ui/editor/plugins/keywords-plugin"
import { LayoutPlugin } from "@/components/ui/editor/plugins/layout-plugin"
import { LinkPlugin } from "@/components/ui/editor/plugins/link-plugin"
import { ListMaxIndentLevelPlugin } from "@/components/ui/editor/plugins/list-max-indent-level-plugin"
import { MentionsPlugin } from "@/components/ui/editor/plugins/mentions-plugin"
import { PageBreakPlugin } from "@/components/ui/editor/plugins/page-break-plugin"
import { AlignmentPickerPlugin } from "@/components/ui/editor/plugins/picker/alignment-picker-plugin"
import { BulletedListPickerPlugin } from "@/components/ui/editor/plugins/picker/bulleted-list-picker-plugin"
import { CheckListPickerPlugin } from "@/components/ui/editor/plugins/picker/check-list-picker-plugin"
import { CodePickerPlugin } from "@/components/ui/editor/plugins/picker/code-picker-plugin"
import { CollapsiblePickerPlugin } from "@/components/ui/editor/plugins/picker/collapsible-picker-plugin"
import { ColumnsLayoutPickerPlugin } from "@/components/ui/editor/plugins/picker/columns-layout-picker-plugin"
import { DividerPickerPlugin } from "@/components/ui/editor/plugins/picker/divider-picker-plugin"
import { EmbedsPickerPlugin } from "@/components/ui/editor/plugins/picker/embeds-picker-plugin"
import { EquationPickerPlugin } from "@/components/ui/editor/plugins/picker/equation-picker-plugin"
import { ExcalidrawPickerPlugin } from "@/components/ui/editor/plugins/picker/excalidraw-picker-plugin"
import { HeadingPickerPlugin } from "@/components/ui/editor/plugins/picker/heading-picker-plugin"
import { ImagePickerPlugin } from "@/components/ui/editor/plugins/picker/image-picker-plugin"
import { NumberedListPickerPlugin } from "@/components/ui/editor/plugins/picker/numbered-list-picker-plugin"
import { PageBreakPickerPlugin } from "@/components/ui/editor/plugins/picker/page-break-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/ui/editor/plugins/picker/paragraph-picker-plugin"
import { PollPickerPlugin } from "@/components/ui/editor/plugins/picker/poll-picker-plugin"
import { QuotePickerPlugin } from "@/components/ui/editor/plugins/picker/quote-picker-plugin"
import {
  DynamicTablePickerPlugin,
  TablePickerPlugin,
} from "@/components/ui/editor/plugins/picker/table-picker-plugin"
import { PollPlugin } from "@/components/ui/editor/plugins/poll-plugin"
import { TabFocusPlugin } from "@/components/ui/editor/plugins/tab-focus-plugin"
import { TableActionMenuPlugin } from "@/components/ui/editor/plugins/table-action-menu-plugin"
import { TableCellResizerPlugin } from "@/components/ui/editor/plugins/table-cell-resizer-plugin"
import { TableHoverActionsPlugin } from "@/components/ui/editor/plugins/table-hover-actions-plugin"
import { BlockFormatDropDown } from "@/components/ui/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/components/ui/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/components/ui/editor/plugins/toolbar/block-format/format-check-list"
import { FormatCodeBlock } from "@/components/ui/editor/plugins/toolbar/block-format/format-code-block"
import { FormatHeading } from "@/components/ui/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/components/ui/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/components/ui/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/components/ui/editor/plugins/toolbar/block-format/format-quote"
import { BlockInsertPlugin } from "@/components/ui/editor/plugins/toolbar/block-insert-plugin"
import { InsertCollapsibleContainer } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-collapsible-container"
import { InsertColumnsLayout } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-columns-layout"
import { InsertEmbeds } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-embeds"
import { InsertExcalidraw } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-excalidraw"
import { InsertHorizontalRule } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-horizontal-rule"
import { InsertImage } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-image"
import { InsertInlineImage } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-inline-image"
import { InsertPageBreak } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-page-break"
import { InsertPoll } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-poll"
import { InsertTable } from "@/components/ui/editor/plugins/toolbar/block-insert/insert-table"
import { ClearFormattingToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { CodeLanguageToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/code-language-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/element-format-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/font-background-toolbar-plugin"
import { FontColorToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/font-color-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/font-family-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/font-format-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/font-size-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/link-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/subsuper-toolbar-plugin"
import { ToolbarPlugin } from "@/components/ui/editor/plugins/toolbar/toolbar-plugin"
import { TypingPerfPlugin } from "@/components/ui/editor/plugins/typing-pref-plugin"
import { EMOJI } from "@/components/ui/editor/transformers/markdown-emoji-transformer"
import { EQUATION } from "@/components/ui/editor/transformers/markdown-equation-transformer"
import { HR } from "@/components/ui/editor/transformers/markdown-hr-transformer"
import { IMAGE } from "@/components/ui/editor/transformers/markdown-image-transformer"
import { TABLE } from "@/components/ui/editor/transformers/markdown-table-transformer"
import { TWEET } from "@/components/ui/editor/transformers/markdown-tweet-transformer"
import { Separator } from "@/components/ui/separator"

const maxLength = 500

export function Plugins({ }) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <Separator orientation="vertical" className="h-8" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatCodeBlock />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === "code" ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <Separator orientation="vertical" className="h-8" />
                <SubSuperToolbarPlugin />
                <LinkToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ClearFormattingToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ElementFormatToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <BlockInsertPlugin>
                  <InsertHorizontalRule />
                  <InsertPageBreak />
                  <InsertImage />
                  <InsertInlineImage />
                  <InsertCollapsibleContainer />
                  <InsertExcalidraw />
                  <InsertTable />
                  <InsertPoll />
                  <InsertColumnsLayout />
                  <InsertEmbeds />
                </BlockInsertPlugin>
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Start typing ..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />

        <MentionsPlugin />
        <PageBreakPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        <ImagesPlugin />
        <InlineImagePlugin />
        <ExcalidrawPlugin />
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        <TableActionMenuPlugin
          anchorElem={floatingAnchorElem}
          cellMerge={true}
        />
        <PollPlugin />
        <LayoutPlugin />
        <EquationsPlugin />
        <CollapsiblePlugin />

        <AutoEmbedPlugin />
        <FigmaPlugin />
        <TwitterPlugin />
        <YouTubePlugin />

        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            IMAGE,
            EMOJI,
            EQUATION,
            TWEET,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
        <TypingPerfPlugin />
        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <ComponentPickerMenuPlugin
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            TablePickerPlugin(),
            CheckListPickerPlugin(),
            NumberedListPickerPlugin(),
            BulletedListPickerPlugin(),
            QuotePickerPlugin(),
            CodePickerPlugin(),
            DividerPickerPlugin(),
            PageBreakPickerPlugin(),
            ExcalidrawPickerPlugin(),
            PollPickerPlugin(),
            EmbedsPickerPlugin({ embed: "figma" }),
            EmbedsPickerPlugin({ embed: "tweet" }),
            EmbedsPickerPlugin({ embed: "youtube-video" }),
            EquationPickerPlugin(),
            ImagePickerPlugin(),
            CollapsiblePickerPlugin(),
            ColumnsLayoutPickerPlugin(),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
          dynamicOptionsFn={DynamicTablePickerPlugin}
        />

        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />

        <ListMaxIndentLevelPlugin />
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            <MaxLengthPlugin maxLength={maxLength} />
            <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
          </div>
          <div>
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-end">
            <SpeechToTextPlugin />
            <ShareContentPlugin />
            <ImportExportPlugin />
            <MarkdownTogglePlugin
              shouldPreserveNewLinesInMarkdown={true}
              transformers={[
                TABLE,
                HR,
                IMAGE,
                EMOJI,
                EQUATION,
                TWEET,
                CHECK_LIST,
                ...ELEMENT_TRANSFORMERS,
                ...MULTILINE_ELEMENT_TRANSFORMERS,
                ...TEXT_FORMAT_TRANSFORMERS,
                ...TEXT_MATCH_TRANSFORMERS,
              ]}
            />
            <EditModeTogglePlugin />
            <>
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </>
            <TreeViewPlugin />
          </div>
        </div>
      </ActionsPlugin>
    </div>
  )
}
