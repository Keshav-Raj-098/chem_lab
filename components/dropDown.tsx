"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AwardType } from "@/lib/generated/prisma/enums"

export interface DropdownOption {
    label: string
    value: string | AwardType
    [key: string]: any // Allows for additional object data
}

interface DropdownProps {
    options: DropdownOption[]
    label?: string
    placeholder?: string
    onSelect: (option: DropdownOption) => void
    defaultValue?: string
    className?: string
    disabled?: boolean
}

export function DropDown({
    options,
    label,
    placeholder = "Select an option...",
    onSelect,
    defaultValue,
    className,
    disabled = false,
}: DropdownProps) {
    return (
        <div className={cn("grid items-center gap-1.5", className)}>
            {label && <span className="text-sm font-medium leading-none">{label}</span>}
            <Select
                disabled={disabled}
                defaultValue={defaultValue}
                onValueChange={(val: string | null) => {
                    if (!val) return
                    const selectedObj = options.find((opt) => opt.value === val)
                    if (selectedObj) {
                        onSelect(selectedObj)
                    }
                }}
            >
                <SelectTrigger className="w-auto min-w-36 text-left">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
