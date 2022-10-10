import PasswordForm from 'components/PasswordForm';

export default function Settings() {
    return (
        <>
            <div className="px-3 md:px-8 h-auto mt-20">
                <div className="container mx-auto max-w-full">
                    <div className="grid grid-cols-1 xl:grid-cols-6">
                        <div className="xl:col-start-1 xl:col-end-5 px-4 mb-16">
                            <PasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
