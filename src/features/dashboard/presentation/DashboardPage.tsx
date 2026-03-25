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
    <Page name="Dashboard">
      <Block strong inset>
        Simple starter screen using Framework7 React components inside
        `App2.tsx`.
      </Block>

      <BlockTitle>Quick Actions</BlockTitle>
      <Card>
        <CardHeader>Food Entry Preview</CardHeader>
        <CardContent>
          <List mediaList inset strongIos dividersIos>
            <ListInput
              label="Food"
              type="text"
              placeholder="Chicken salad"
              clearButton
            />
            <ListInput
              label="Serving"
              type="text"
              placeholder="1 bowl"
              clearButton
            />
          </List>

          <Block>
            <Chip text="Recent: Oats" />
            <Chip text="High Protein" />
            <Chip text="Lunch" />
          </Block>

          <Block>
            <Button fill large>
              Save Entry
            </Button>
            <Button tonal large>
              View Summary
            </Button>
          </Block>
        </CardContent>
      </Card>

      <BlockTitle>Today</BlockTitle>
      <List inset strong>
        <ListItem title="Calories" after="1,420 kcal" />
        <ListItem title="Protein" after="96 g" />
        <ListItem title="Carbs" after="134 g" />
        <ListItem title="Fat" after="48 g" />
      </List>

      <Block strong inset>
        <Link>History</Link>
        <Link>Goals</Link>
        <Link>Insights</Link>
      </Block>
    </Page>
  );
};
