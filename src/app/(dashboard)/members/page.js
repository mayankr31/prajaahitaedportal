import React from 'react'
import { redirect } from 'next/navigation'

export default function Page(props) {
    redirect('/members/students');
}
