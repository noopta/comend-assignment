import { PaperClipIcon } from '@heroicons/react/20/solid'
import { useAuth } from '../app/context/AuthProvider';

export default function ProfileContent() {
    const { user } = useAuth();

    return (
        <div className="mx-auto max-w-7xl px-24 lg:px-8 py-32">
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Profile Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Your current account details.</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user ? user['firstName'] + " " + user['lastName'] : ""}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user ? user['email'] : ""}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">Date of Birth</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user ? user['dateOfBirth'] : ""}</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}
