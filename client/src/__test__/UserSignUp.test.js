import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SignUp } from "../pages/signUp";

// describe("Sign up users", ()=>{
//     it("Render the necessaries fields", ()=> {
//         render(<SignUp/>)
//         const inputName = screen.getByLabelText(/Nome/i));
//     }


// })