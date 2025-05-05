import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { observer } from "mobx-react";
import { ClockIcon } from "outline-icons";
import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Document from "~/models/Document";
import { Avatar } from "~/components/Avatar";

type Props = {
  document: Document;
  showCollection?: boolean;
  showDraft?: boolean;
  showPin?: boolean;
  showPublished?: boolean;
  showTemplate?: boolean;
  showParentDocuments?: boolean;
};

function DocumentCardMUI({
  document,
  showCollection: _showCollection,
  showDraft: _showDraft,
  showPin: _showPin,
  showPublished: _showPublished,
  showTemplate: _showTemplate,
  showParentDocuments: _showParentDocuments,
}: Props) {
  const updatedAt = formatDistanceToNow(new Date(document.updatedAt), {
    addSuffix: true,
  });
  const updatedBy = document.updatedBy;

  return (
    <StyledCard elevation={1}>
      <CardActionArea component={Link} to={document.url}>
        <CardContent>
          <Typography variant="h6" noWrap>
            {document.titleWithDefault}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {document.getSummary()}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            {updatedBy && <Avatar src={updatedBy.avatarUrl} size={24} />}
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {updatedBy ? updatedBy.name : ""}
            </Typography>
            <Clock size={16} />
            <Typography variant="caption" color="text.secondary">
              {updatedAt}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  margin: 0 0 8px;
  border-radius: 4px;
`;

const Clock = styled(ClockIcon)`
  margin-left: 8px;
  margin-right: 4px;
`;

export default observer(DocumentCardMUI);
