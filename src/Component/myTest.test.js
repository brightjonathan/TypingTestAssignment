import React from 'react'
import App from '../App'
import {render} from '@testing-library/react'
import '@testing-library/jest-dom'

//testing the 
test('seconds countdown starting from 120 ', ()=>{
    const { getAllByTestId } = render( <App/> )
    const counterdownEl = getAllByTestId('countdown');
    expect(counterdownEl.value).toBe("120")
});

//tesing the btn 
test('button testing', ()=>{
   const { getAllByTestId } = render( <App /> );
   const counterdownEl = getAllByTestId("input");
   expect(counterdownEl.textContent).toBe("Start");
});



