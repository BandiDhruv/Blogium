import {act, fireEvent, render, screen, waitFor} from "@testing-library/react"
import { SignIn } from "../pages/Signin"
import { SignUp } from "../pages/Signup"
import { MemoryRouter } from "react-router-dom"
import axios from "axios"
import { Qoute } from "../components/Qoute"
import { Auth } from "../components/Auth"

jest.mock("axios");
const mockedAxios=axios as jest.Mocked<typeof axios>

describe("Signup/Signin Page Tests",()=>{
    test('renders correctly',()=>{
            render(
                <MemoryRouter>
                    <SignIn />
                </MemoryRouter>
            )
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            )
    })
    describe("Qoute Component Tests",()=>{
        test('renders quote when api calls succeed', async ()=>{
            const mockQuotes = {
                quotes: [
                    { id: '1', quote: 'First random quote', author: 'Author One' },
                    { id: '2', quote: 'Second random quote', author: 'Author Two' },
                ],
                total: 2,
                skip: 0,
                limit: 2,
            };
            mockedAxios.get.mockResolvedValueOnce({
                status:200,
                data:mockQuotes,
            });

            await act(async()=>{
                render(<Qoute />)
            })
            
            expect(screen.getByText('First random quote')).toBeInTheDocument();
            expect(screen.getByText(':~ Author One')).toBeInTheDocument();
            expect(screen.queryByText('Second random quote')).not.toBeInTheDocument();
        })
        test.skip('renders error message when API call fails', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API error'));
            await act(async () => {
                render(<Qoute />);
            });
            expect(await screen.findByText("")).toBeInTheDocument();
        })
    });
    describe('Auth Component Tests', () => { 
        test('renders signup form correctly', () => {
            render(
              <MemoryRouter>
                <Auth type="signup" />
              </MemoryRouter>
            );
            
            expect(screen.getByText('Create an account')).toBeInTheDocument();
            expect(screen.getByLabelText('Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByText('SignUp')).toBeInTheDocument();
          });
          
        test('renders signin form correctly', () => {
            render(
              <MemoryRouter>
                <Auth type="signin" />
              </MemoryRouter>
            );
            
            expect(screen.getByText('Sign in to your Account')).toBeInTheDocument();
            expect(screen.queryByLabelText('Name')).not.toBeInTheDocument(); // Name input should not be present
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByText('SignIn')).toBeInTheDocument();
          });

        test('updates input fields on change', () => {
            render(
              <MemoryRouter>
                <Auth type="signup" />
              </MemoryRouter>
            );
          
            const nameInput = screen.getByPlaceholderText('Your Name...');
            const emailInput = screen.getByPlaceholderText('Your Email...');
            const passwordInput = screen.getByPlaceholderText('Your Password...');
          
            fireEvent.change(nameInput, { target: { value: 'John Doe' } });
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
          
            expect(nameInput).toHaveValue('John Doe');
            expect(emailInput).toHaveValue('john@example.com');
            expect(passwordInput).toHaveValue('password123');
          });

        test('makes API call on form submission', async () => {
            mockedAxios.post.mockResolvedValueOnce({ data: { token: 'fake-jwt-token' } });
          
            render(
              <MemoryRouter>
                <Auth type="signup" />
              </MemoryRouter>
            );
          
            const emailInput = screen.getByPlaceholderText('Your Email...');
            const passwordInput = screen.getByPlaceholderText('Your Password...');
            const submitButton = screen.getByText('SignUp');
          
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            fireEvent.click(submitButton);
          
            await waitFor(() => {
              expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), {
                name: '',
                email: 'john@example.com',
                password: 'password123',
              });
            });
          });

        
    })
})