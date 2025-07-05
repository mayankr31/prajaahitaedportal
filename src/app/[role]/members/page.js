import React from 'react'
import { redirect } from 'next/navigation'

export default async function Page({params}) {
    const { role } = await params;
    redirect(`/${role}/members/students`);
}
