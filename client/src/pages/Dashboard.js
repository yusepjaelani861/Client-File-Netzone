import StatusCard from "components/StatusCard";
import NewestFilesUpload from "components/NewestFilesUpload";
import { useEffect, useState } from "react";
import { getCookie } from "assets/utils/helper";
import { removeCookie } from "assets/utils/helper";
import ApiCard from "components/ApiCard";
import { formatSize } from "assets/utils/helper";
import { convertNumberToString } from "assets/utils/helper";
import LoadingScreen from "components/LoadingScreen";
import { notify } from "assets/utils/helper";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    total_files: "0",
    total_users: "0",
    total_usage: "0",
    total_api: "0",
    files: [],
    api: [],
  });

  useEffect(() => {
    const token = getCookie("token");
    if (token === "" || token === undefined) {
        window.location.href = "/login";
    }

    setLoading(true);
    setTimeout(() => {
        try {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/dashboard`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success === true) {
                    setData(data.data);
                    setLoading(false);
                } else if (data.error.error_code === 0) {
                    removeCookie("token");
                    window.location.href = "/login";
                } else {
                    setLoading(false);
                    notify(data.message);
                }
              })
              .catch((err) => {
                setLoading(false);
                notify(err.message);
              });
        } catch (err) {
            setLoading(false);
            notify(err.message);
        }
    }, 500)
  }, []);

  return (
    <>
        {loading ? (
            <LoadingScreen />
        ) : (
            <></>
        )}
        
      <div className="bg-light-blue-500 px-3 md:px-8 h-18 mb-10" />

      <div className="px-3 md:px-8">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-4">
            <StatusCard
              color="pink"
              icon="trending_up"
              title="Files"
              amount={convertNumberToString(data.total_files)}
              percentage="3.48"
              percentageIcon="arrow_upward"
              percentageColor="green"
              date="Since last month"
            />
            <StatusCard
              color="orange"
              icon="groups"
              title="Users"
              amount={convertNumberToString(data.total_users)}
              percentage="3.48"
              percentageIcon="arrow_downward"
              percentageColor="red"
              date="Since last week"
            />
            <StatusCard
              color="purple"
              icon="storage"
              title="Usage"
              amount={convertNumberToString(formatSize(data.total_usage))}
              percentage="1.10"
              percentageIcon="arrow_downward"
              percentageColor="orange"
              date="Since yesterday"
            />
            <StatusCard
              color="orange"
              icon="key"
              title="API Keys"
              amount={convertNumberToString(data.total_api)}
              percentage="3.48"
              percentageIcon="arrow_downward"
              percentageColor="red"
              date="Since last week"
            />
            {/* <StatusCard
              color="blue"
              icon="poll"
              title="Performance"
              amount={data.performa + "%"}
              percentage="12"
              percentageIcon="arrow_upward"
              percentageColor="green"
              date="Since last month"
            /> */}
          </div>
        </div>
      </div>

      <div className="px-3 md:px-8 h-auto">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 xl:grid-cols-5">
            <div className="xl:col-start-1 xl:col-end-4 px-4 mb-14">
              <NewestFilesUpload data={data.files} />
            </div>
            <div className="xl:col-start-4 xl:col-end-6 px-4 mb-14">
              <ApiCard data={data.api} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
