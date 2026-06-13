import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import InputError from '@/components/input-error';

interface Property {
    id: number;
    name: string;
}

interface PropertySelectProps {
    properties: Property[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    name?: string;
    error?: string;
    disabled?: boolean;
}

export function PropertySelect({
    properties,
    value,
    onValueChange,
    placeholder = 'Select a property...',
    className,
    name,
    error,
    disabled = false,
}: PropertySelectProps) {
    return (
        <div className="grid gap-1.5 w-full">
            <Select value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
                <SelectTrigger className={cn('w-full border-input text-left', error && 'border-destructive', className)}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                    {properties.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center select-none">
                            No properties available
                        </div>
                    ) : (
                        properties.map((property) => (
                            <SelectItem key={property.id} value={property.id.toString()}>
                                {property.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
            {error && <InputError message={error} />}
        </div>
    );
}
