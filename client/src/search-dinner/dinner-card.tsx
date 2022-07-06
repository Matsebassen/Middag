import { Dinner } from '../models/dinner';
import './dinner-card.scss';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { RecipeItem } from '../models/recipeItem';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ( {
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
} ));

const openInNewTab = (url: string) => {
  window.open(url, '_blank');
}

export const DinnerCard = (props: {
  dinner: Dinner,
  addDinnerToList: (dinner: Dinner) => void,
  openMenu: (event: React.MouseEvent<HTMLButtonElement>, dinner: Dinner) => void
}) => {
  const [ expanded, setExpanded ] = React.useState(false);

  const expandDinner = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="dinner-card">
      <CardHeader
        className="dinner-card__header"
        action={
          <IconButton aria-label="settings"
                      onClick={(event) => props.openMenu(event, props.dinner)}>
            <MoreVertIcon color="secondary"/>
          </IconButton>
        }
        title={props.dinner.name?.toLowerCase()}
        subheader={props.dinner.tags}
      />
      <CardMedia
        component="img"
        height="160"
        image={props.dinner.picUrl}
        alt={props.dinner.name}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.dinner.portions} portions
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button onClick={() => props.addDinnerToList(props.dinner)}>
          Add to list
        </Button>
        <Button onClick={() => openInNewTab(props.dinner.url)}>
          Website
        </Button>
        <ExpandMore
          expand={expanded}
          onClick={expandDinner}
          aria-expanded={expanded}
          aria-label="show ingredients"
        >
          <Tooltip title="Show ingredients">
            <ExpandMoreIcon color="secondary"/>
          </Tooltip>
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded}
                timeout="auto"
                unmountOnExit>
        <CardContent>
          <IngredientsTable ingredients={props.dinner.ingredients}/>
        </CardContent>
      </Collapse>
    </Card>
  );
}

const IngredientsTable = (props: { ingredients: RecipeItem[] }) => {
  if ( !props.ingredients?.length ) {
    return ( <div>Loading ingredients...</div> );
  }
  return (
    <TableContainer component={Paper}
                    sx={{ boxShadow: 'none' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.ingredients?.map((recipeItem) => (
            <TableRow
              key={recipeItem.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th"
                         scope="row">
                {recipeItem.ingredient.name}
              </TableCell>
              <TableCell align="right">{recipeItem.qty}</TableCell>
              <TableCell align="right">{recipeItem.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
