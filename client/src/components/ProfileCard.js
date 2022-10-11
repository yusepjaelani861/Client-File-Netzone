import Card from "@material-tailwind/react/Card";
import Image from "@material-tailwind/react/Image";

export default function ProfileCard({ user }) {
let url = 'https://ui-avatars.com/api/?name=' + user.name + '&background=0D8ABC&color=fff&size=128';
// let url = `${process.env.REACT_APP_BACKEND_URL}/images/300/${user.avatar}`
  return (
    <Card>
      <div className="flex flex-wrap justify-center">
        <div className="w-28 px-4 mb-4">
          <Image src={url} rounded raised />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium" color="gray">{user.name}</p>
      </div>
    </Card>
  );
}
