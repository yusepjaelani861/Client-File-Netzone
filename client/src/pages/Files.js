import TableCard from 'components/TableCard';
import { useState } from 'react';

export default function Files(props) {
    const [page] = useState(props.location.search ?? '?page=1')

    return (
        <>
            <div className="px-3 md:px-8 h-auto -mt-24 pt-32">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 px-4 mb-8" id="da">
                        <TableCard page={page} />
                    </div>
                </div>
            </div>
        </>
    );
}
