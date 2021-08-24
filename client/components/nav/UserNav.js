import { useState, useEffect } from 'react'
import Link from 'next/link'

const UserNav = () => {
    const [current, setCurrent] = useState('')


    return (
        <div className="nav flex-column nav-pills">
            <Link href="/user">
                <a className={`nav-link ${current === "/user" && "active"}`}>
                    Dashboard
                </a>
            </Link>
        </div>
    )
}

export default UserNav;