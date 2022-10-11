import SidebarDocumentation from "components/Documentation/SidebarDocumentation";
import FileApi from "pages/Documentation/FileApi";
import Iframe from "pages/Documentation/Iframe";
import ListFile from "pages/Documentation/ListFile";
import Overview from "pages/Documentation/Overview";
import Uploading from "pages/Documentation/Uploading";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

function Documentation() {
const location = useLocation().pathname;
  return (
    <>
      <SidebarDocumentation />
      <div className="container">
        <div className="md:ml-64 w-full">
            <div className="container max-w-full mx-auto flex items-center justify-between md:pr-8 md:pl-10 mt-5">
                <div className="flex justify-center items-center pl-40">
                    <h1 className="text-2xl font-bold tracking-wider mt-1">
                    {location === '/docs' ? "DOCUMENTATION" : `DOCUMENTATION - ${location.replace('/docs/', '').toUpperCase()}`}
                    </h1>
                </div>
            </div>
          <Switch>
            <Route exact path="/docs/overview" component={Overview} />
            <Route exact path="/docs/uploads" component={Uploading} />
            <Route exact path="/docs/file/api" component={FileApi} />
            <Route exact path="/docs/file/list" component={ListFile} />
            <Route exact path="/docs/iframe" component={Iframe} />
            <Redirect from="/docs" to="/docs/overview" />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default Documentation;
