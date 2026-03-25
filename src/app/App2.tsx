import Framework7 from "framework7/lite-bundle";
import Framework7React, {
  App,
  Block,
  BlockTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  Page,
  Toolbar,
  View,
} from "framework7-react";

Framework7.use(Framework7React);

const appParameters = {
  name: "GenCalories",
  theme: "auto" as const,
};

function HomePage() {
  return (
    <Page name="home">
      <Navbar title="GenCalories" subtitle="Framework7 React demo" />

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

      <Toolbar bottom>
        <Link>Home</Link>
        <Link>Search</Link>
        <Link>Profile</Link>
      </Toolbar>
    </Page>
  );
}

export default function App2() {
  return (
    <App {...appParameters}>
      <View main className="safe-areas">
        <HomePage />
      </View>
    </App>
  );
}
