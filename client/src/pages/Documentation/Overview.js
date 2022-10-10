import { Button } from "@material-tailwind/react";
import CardBox from "components/CardBox";
import { NavLink } from "react-router-dom";

export default function Overview() {
  return (
    <>
      <div className="bg-light-blue-500 px-3 md:px-8 h-18 mb-10" />
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-12/12 mb-12 px-4">
            <CardBox>
              <h1 className="text-2xl font-bold">What is File Netzone?</h1>
              <p className="text-gray-600 mb-5">
                File Netzone is a file sharing platform that allows you to
                upload and share files with your friends, family, and
                colleagues. It is a free and open-source project that is
                maintained by a community of developers.
              </p>

              <a href="/register" className="text-white">
                <Button
                  color="lightBlue"
                  buttonType="filled"
                  size="regular"
                  rounded={false}
                  block={false}
                  iconOnly={false}
                  ripple="light"
                >
                  Get Started
                </Button>
              </a>
            </CardBox>
          </div>
        </div>
      </div>
    </>
  );
}
