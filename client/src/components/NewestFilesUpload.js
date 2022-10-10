import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import Button from "@material-tailwind/react/Button";
import { formatDate, formatSize } from "assets/utils/helper";
import { NavLink } from "react-router-dom";

export default function NewestFilesUpload({data}) {
  return (
    <Card>
      <CardHeader color="blue" contentPosition="none">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-white text-2xl">Newest Files Uploaded</h2>
          <Button
            color="transparent"
            buttonType="link"
            size="lg"
            style={{ padding: 0 }}
          >
            <NavLink
              to="/files"
              className="text-white block w-full text-center"
            >
            See More
            </NavLink>
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  ID
                </th>
                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  API
                </th>
                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  Filename
                </th>
                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  Size
                </th>
                <th className="px-2 text-teal-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              { data.length > 0 ?
              data.map((item, index) => {
                return (
                  <tr key={index}>
                    <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                      {item.id}
                    </th>
                    <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                      {item.api.domain}
                    </td>
                    <td className="border-b border-gray-200 align-middle font-light text-sm flex-wrap px-2 py-4 text-left">
                      <button
                        className="hover:text-blue-700 text-left"
                        // href={`${process.env.REACT_APP_BACKEND_URL}/download/${item.url}`} 
                        onClick={() => {
                          window.location.href = `${process.env.REACT_APP_BACKEND_URL}/download/${item.url}`
                        }}
                        rel="nofollow" 
                        title={item.name}
                    >{item.name}</button>
                    </td>
                    <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                      {formatSize(item.size)}
                    </td>
                    <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan="5" className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
