import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  Card,
  CardHeader,
  CardContent,
  List,
  ListInput,
  Chip,
  Button,
  ListItem,
  Link,
  Toolbar,
  View,
} from "framework7-react";

export const DashboardPage = () => {
  return (
    <Page name="Diary">
      <Navbar title="Diary" />
      <Card title="Overview" raised />

      <Card title="Breakfast" raised>
        <CardContent>
          <List mediaList inset strongIos dividersIos>
            <ListItem title="Oatmeal">
              <img
                slot="media"
                src="https://cdn.framework7.io/placeholder/fashion-88x88-4.jpg"
                width="44"
              />
              <Chip text="150 cal" slot="after" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Card title="Lunch" raised />
      <Card title="Dinner" raised />
      <Card title="Snacks" raised />
    </Page>
  );
};
