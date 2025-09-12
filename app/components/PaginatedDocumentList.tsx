import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";
import Document from "~/models/Document";
import DocumentListItem from "~/components/DocumentListItem";
import DocumentCardCollection from "~/components/DocumentCardCollection";
import Error from "~/components/List/Error";
import PaginatedList from "~/components/PaginatedList";

type Props = {
  documents: Document[];
  fetch: (options: unknown) => Promise<Document[] | undefined>;
  options?: Record<string, unknown>;
  heading?: React.ReactNode;
  empty?: JSX.Element;
  showParentDocuments?: boolean;
  showCollection?: boolean;
  showPublished?: boolean;
  showDraft?: boolean;
  showTemplate?: boolean;
  viewMode?: "list" | "card";
};

const PaginatedDocumentList = React.memo<Props>(function PaginatedDocumentList({
  empty,
  heading,
  documents,
  fetch,
  options,
  showParentDocuments,
  showCollection,
  showPublished,
  showTemplate,
  showDraft,
  viewMode = "list",
  ...rest
}: Props) {
  const { t } = useTranslation();

  const renderItem = (item: Document, _index: number) => {
    if (viewMode === "card") {
      return (
        <DocumentCardCollection
          key={item.id}
          document={item}
          showParentDocuments={showParentDocuments}
          showCollection={showCollection}
          showPublished={showPublished}
        />
      );
    }

    return (
      <DocumentListItem
        key={item.id}
        document={item}
        showParentDocuments={showParentDocuments}
        showCollection={showCollection}
        showPublished={showPublished}
        showTemplate={showTemplate}
        showDraft={showDraft}
      />
    );
  };

  const content = (
    <PaginatedList<Document>
      aria-label={t("Documents")}
      items={documents}
      empty={empty}
      heading={heading}
      fetch={fetch}
      options={options}
      renderError={(props) => <Error {...props} />}
      renderItem={renderItem}
      {...rest}
    />
  );

  if (viewMode === "card") {
    return <CardGrid>{content}</CardGrid>;
  }

  return content;
});

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  ${breakpoint("mobileLarge")`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `};

  ${breakpoint("tablet")`
    grid-template-columns: repeat(4, minmax(0, 1fr));
  `};
`;

export default PaginatedDocumentList;
