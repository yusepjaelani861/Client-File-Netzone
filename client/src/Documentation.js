import SidebarDocumentation from "components/Documentation/SidebarDocumentation";
import FileApi from "pages/Documentation/FileApi";
import Iframe from "pages/Documentation/Iframe";
import Overview from "pages/Documentation/Overview";
import Uploading from "pages/Documentation/Uploading";
import { Redirect, Route, Switch } from "react-router-dom";

function Documentation() {
  return (
    <>
      <SidebarDocumentation />
      <div className="lg:flex">
        <div className="md:ml-64 w-3/5">
          <Switch>
            <Route exact path="/docs/overview" component={Overview} />
            <Route exact path="/docs/uploads" component={Uploading} />
            <Route exact path="/docs/file" component={FileApi} />
            <Route exact path="/docs/iframe" component={Iframe} />
            <Redirect from="/docs" to="/docs/overview" />
          </Switch>
        </div>
        <div className="w-2/5">
          <div className="">Cokkk</div>
        </div>
      </div>
    </>
  );
}

export default Documentation;
