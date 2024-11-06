import Link from 'next/link'
import React from 'react'

const Navlink = ({ link, url }: { link: string, url: string }) => {
    return (
        <div>
            <Link href={url}>
                <p className='text-white hover:text-gray-300'>
                    {link}
                </p>
            </Link>
        </div>
    )
}

export default Navlink
