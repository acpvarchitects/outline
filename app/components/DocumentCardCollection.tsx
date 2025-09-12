import * as React from "react";
import { observer } from "mobx-react";
import { DocumentIcon } from "outline-icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Icon from "@shared/components/Icon";
import Squircle from "@shared/components/Squircle";
import { s, hover, ellipsis } from "@shared/styles";
import { IconType } from "@shared/types";
import { determineIconType } from "@shared/utils/icon";
import Document from "~/models/Document";
import Time from "~/components/Time";
import useStores from "~/hooks/useStores";
import CollectionIcon from "~/components/Icons/CollectionIcon";
import Text from "~/components/Text";

type Props = {
  document: Document;
  showCollection?: boolean;
  showPublished?: boolean;
  showParentDocuments?: boolean;
};

function DocumentCardCollection({ document }: Props) {
  const { collections } = useStores();
  const collection = document.collectionId
    ? collections.get(document.collectionId)
    : undefined;

  const hasEmojiInTitle = determineIconType(document.icon) === IconType.Emoji;

  return (
    <CardContainer>
      <DocumentLink
        dir={document.dir}
        to={{
          pathname: document.url,
          state: {
            title: document.titleWithDefault,
          },
        }}
      >
        <CardContent>
          <IconContainer>
            {document.icon ? (
              <DocumentSquircle
                icon={document.icon}
                color={document.color ?? undefined}
                initial={document.initial}
              />
            ) : (
              <Squircle color={collection?.color || undefined}>
                {collection?.icon &&
                collection?.icon !== "letter" &&
                collection?.icon !== "collection" ? (
                  <CollectionIcon collection={collection} color="white" />
                ) : (
                  <DocumentIcon color="white" />
                )}
              </Squircle>
            )}
          </IconContainer>

          <ContentArea>
            <Title dir={document.dir}>
              {hasEmojiInTitle
                ? document.titleWithDefault.replace(document.icon!, "")
                : document.titleWithDefault}
            </Title>

            <MetaInfo>
              <AuthorInfo>
                {document.createdBy?.name && (
                  <Text size="xsmall" type="tertiary">
                    {document.createdBy.name}
                  </Text>
                )}
              </AuthorInfo>
              <TimeInfo>
                <Text size="xsmall" type="tertiary">
                  <Time dateTime={document.updatedAt} addSuffix />
                </Text>
              </TimeInfo>
            </MetaInfo>
          </ContentArea>
        </CardContent>
      </DocumentLink>
    </CardContainer>
  );
}

const DocumentSquircle = ({
  icon,
  color,
  initial,
}: {
  icon: string;
  color?: string;
  initial?: string;
}) => {
  const iconType = determineIconType(icon)!;
  const squircleColor = iconType === IconType.SVG ? color : undefined;

  return (
    <Squircle color={squircleColor}>
      <Icon value={icon} color="white" initial={initial} forceColor />
    </Squircle>
  );
};

const CardContainer = styled.div`
  width: 100%;
  height: 200px;
`;

const DocumentLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${s("inputBorder")};
  background: ${s("background")};
  cursor: var(--pointer);
  transition: all 150ms ease-in-out;

  &: ${hover} {
    border-color: ${s("inputBorderFocused")};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const IconContainer = styled.div`
  margin-bottom: 12px;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: ${s("text")};
  ${ellipsis()}
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const AuthorInfo = styled.div``;

const TimeInfo = styled.div``;

export default observer(DocumentCardCollection);
