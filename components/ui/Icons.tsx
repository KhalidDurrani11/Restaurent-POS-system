import React from 'react';

const DuotoneIcon: React.FC<{ children: React.ReactNode } & React.SVGProps<SVGSVGElement>> = ({ children, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        {children}
    </svg>
);

export const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <DuotoneIcon {...props}>
        <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9z" clipRule="evenodd" className="text-indigo-400 opacity-40" />
        <path d="M9.75 9.75A.75.75 0 0110.5 9h3a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-9z" className="text-indigo-400" />
    </DuotoneIcon>
);

export const PosIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <DuotoneIcon {...props}>
        <path d="M12.75 2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V2.25z" className="text-indigo-400" />
        <path fillRule="evenodd" d="M10.5 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zM15 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z" className="text-indigo-400 opacity-40" />
        <path fillRule="evenodd" d="M2.25 9.75A.75.75 0 013 9h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V9.75zM15 12a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 0115 12z" clipRule="evenodd" className="text-indigo-400" />
        <path d="M9.75 12.75a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" className="text-indigo-400 opacity-40" />
    </DuotoneIcon>
);

export const ProductIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <DuotoneIcon {...props}>
        <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zm1.5 1.5a.75.75 0 00-1.5 0V6A.75.75 0 006 6.75h1.5a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75zM9 4.5A.75.75 0 007.5 6v1.5a.75.75 0 001.5 0V6a.75.75 0 00-.75-.75z" clipRule="evenodd" className="text-indigo-400 opacity-40" />
        <path d="M12.75 9a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V9z" className="text-indigo-400" />
    </DuotoneIcon>
);

export const ReportsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <DuotoneIcon {...props}>
        <path d="M12 1.5a.75.75 0 01.75.75V3h-1.5V2.25A.75.75 0 0112 1.5z" className="text-indigo-400 opacity-40" />
        <path fillRule="evenodd" d="M3.75 4.5a.75.75 0 00-.75.75v13.5a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H3.75zM12 7.5a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM8.25 9.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" className="text-indigo-400" />
    </DuotoneIcon>
);

export const AiIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <DuotoneIcon {...props}>
        <path d="M15.59 4.87a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L18.84 10l-3.25-3.25a.75.75 0 010-1.06zM8.41 4.87a.75.75 0 00-1.06 0L3.1 9.12a.75.75 0 000 1.06l4.25 4.25a.75.75 0 001.06-1.06L5.16 10l3.25-3.25a.75.75 0 000-1.06z" className="text-indigo-400 opacity-40" />
        <path fillRule="evenodd" d="M12 3a.75.75 0 01.75.75v16.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0112 3z" clipRule="evenodd" className="text-indigo-400" />
    </DuotoneIcon>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <DuotoneIcon {...props}>
        <path d="M12 12.25c-2.485 0-4.5 1.567-4.5 3.5V17h9v-1.25c0-1.933-2.015-3.5-4.5-3.5z" className="text-indigo-400 opacity-40" />
        <path d="M12 4.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" className="text-indigo-400" />
    </DuotoneIcon>
);

export const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <DuotoneIcon {...props}>
        <path d="M11.25 3.75A1.5 1.5 0 009.75 5.25v13.5A1.5 1.5 0 0011.25 20.25h3.75a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3h-3.75a3 3 0 01-3-3V5.25a3 3 0 013-3h3.75a3 3 0 013 3V7.5a.75.75 0 01-1.5 0V5.25a1.5 1.5 0 00-1.5-1.5h-3.75z" className="text-red-400 opacity-40" />
        <path d="M16.19 12.53a.75.75 0 000-1.06l-4.5-4.5a.75.75 0 10-1.06 1.06L14.06 11H7.75a.75.75 0 100 1.5h6.31l-3.44 3.44a.75.75 0 101.06 1.06l4.5-4.5z" className="text-red-400" />
    </DuotoneIcon>
);

export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export const CurrencyDollarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982.554-.415 1.278-.659 2.003-.659 1.171 0 2.342.879 3.513 1.758" /></svg>
);
export const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.826l1.821-6.831c.14-.523-.199-1.074-.746-1.074H4.893c-.548 0-.886.551-.746 1.074L5.29 7.5M7.5 14.25v-6.375" /></svg>
);
export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.037 1.24-2.062 2.047-3.001a4.5 4.5 0 00-6.101-6.101c-1.052 1.052-1.759 2.404-2.108 3.862M3.75 12.562c1.03-1.433 2.114-2.73 3.33-3.862a4.5 4.5 0 016.101 6.101M14.25 10.364c.542-.542 1.152-.924 1.81-1.152a4.5 4.5 0 016.101 6.101c-.329.658-.738 1.268-1.21 1.81" /></svg>
);
export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
);