import React from 'react';
import { redirect } from 'next/navigation';

export default function Home(props) {

  redirect('/signup');
}
