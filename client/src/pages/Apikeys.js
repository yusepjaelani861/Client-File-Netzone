import TableApikeys from "components/TableApikeys";

export default function Apikeys() {
    return (
        <>
            <div className="px-3 md:px-8 h-auto -mt-24 pt-32">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 px-4 mb-8" id="da">
                        <TableApikeys />
                    </div>
                </div>
            </div>
        </>
    )
}