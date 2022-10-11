import { Card, CardBody } from "@material-tailwind/react";

export default function Uploading() {
    return ( 
        <div>
            <div className="bg-light-blue-500 px-3 md:px-8 h-18 mb-10" />
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 mb-12 px-4">
                        <Card>
                            <h1 className="text-3xl font-bold text-gray-800">Uploading</h1>
                            <CardBody>
                                <div className="mb-8 text-sm">

                                    <h2 className="text-2xl font-bold text-gray-800 py-2">Basic Upload</h2>
                                    <p className="text-gray-500">
                                        Beyond the picker widgets, Filestack still offers easy ways to get files uploaded and ready for delivery.
                                        If all you need is one HTTP request from file to cloud then Filestack can help. The Filestack File API provides several methods for uploading files over HTTP:
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-800 py-2">Upload File</h3>
                                    <p className="text-gray-500 mb-4">
                                        Sample request:
                                    </p>
                                    <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                                        <code>
                                            {`curl -X POST /api/v1/upload/single \\
    -F apikey=YOUR_API_KEY \\
    -F file=@/path/to/file`}
                                        </code>
                                    </pre>

                                    <p className="mb-4">
                                        Sample response:
                                    </p>
                                    <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                                        <code>
                                            {`{
    "success": true,
    "message": "File berhasil diunggah",
    "data": {
        "name": "101296998_p0_master1200 (2).jpeg",
        "extension": "jpeg",
        "mime_type": "image/jpeg",
        "size": 1479311,
        "url": "/download/1a0a62886163d38"
    },
    "error": {
        "error_code": "",
        "error_data": []
    },
    "pagination": []
}`}
                                        </code>
                                    </pre>

                                    <h3 className="text-xl font-bold text-gray-800 py-2">Upload URL</h3>
                                    <p className="text-gray-500 mb-4">
                                        Sample request:
                                    </p>
                                    <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                                        <code>
                                            {`curl -X POST /api/v1/upload/url \\
    -F apikey=YOUR_API_KEY \\
    -F url=https://torrent.mitehost.my.id/CoverCorp.jpeg`}
                                        </code>
                                    </pre>

                                    <p className="mb-4">
                                        Sample response:
                                    </p>
                                    <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                                        <code>
                                            {`{
    "success": true,
    "message": "File berhasil diunggah",
    "data": {
        "name": "CoverCorp.jpeg",
        "extension": "jpeg",
        "mime_type": "image/jpeg",
        "size": 2072981,
        "url": "/download/4d40c896eb97cc9"
    },
    "error": {
        "error_code": "",
        "error_data": []
    },
    "pagination": []
}`}
                                        </code>
                                    </pre>

                                    <h3 className="text-xl font-bold text-gray-800 py-2">Multiple Upload</h3>
                                    <p className="text-gray-500 mb-4">
                                        Sample request:
                                    </p>
                                    <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                                        <code>
                                            {`curl -X POST /api/v1/upload/multiple \\
    -F apikey=YOUR_API_KEY \\
    -F file=@/path/to/file \\
    -F file=@/path/to/file`}
                                        </code>
                                    </pre>

                                    <p className="mb-4">
                                        Sample response:
                                    </p>
                                    <pre className="bg-ice-gray-100 p-4 rounded-lg border bg-black text-white mb-5 overflow-auto w-full">
                                        <code>
                                            {`{
    "success": true,
    "message": "File berhasil diunggah",
    "data": [
        {
            "name": "16ab23f6e648e1372b87f094f681b7ee-roti-tawar-goreng-isi-tuna (1).webp",
            "extension": "webp",
            "mime_type": "image/webp",
            "size": 67182,
            "url": "/download/79a0988ffe5f854"
        },
        {
            "name": "adoc.pub_solusi-numerik-persamaan-fokker-planck-dengan-meto (1) (1) (1).pdf",
            "extension": "pdf",
            "mime_type": "application/pdf",
            "size": 1370820,
            "url": "/download/757792720f5e9e8"
        }
    ],
    "error": {
        "error_code": "",
        "error_data": []
    },
    "pagination": []
}`}
                                        </code>
                                    </pre>


                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}