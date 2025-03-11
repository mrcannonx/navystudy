declare module "@/components/ui/textarea" {
  import { TextareaHTMLAttributes } from "react"
  
  export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}
  
  export const Textarea: React.ForwardRefExoticComponent<
    TextareaProps & React.RefAttributes<HTMLTextAreaElement>
  >
}

declare module "@/components/ui/input" {
  import { InputHTMLAttributes } from "react"
  
  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
  
  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >
}

declare module "@/components/ui/button" {
  import { ButtonHTMLAttributes } from "react"
  
  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
  }
  
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >
}