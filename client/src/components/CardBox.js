import { Card, CardBody } from "@material-tailwind/react";

export default function CardBox({ children, className = '' }) {
  return (
    <div className="mb-8">
      <Card className={`${className}`}>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
}
