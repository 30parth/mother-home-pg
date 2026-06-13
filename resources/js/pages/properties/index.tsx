import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { Plus, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { index as propertiesIndex, store as propertiesStore } from '@/routes/properties';

interface Property {
    id: number;
    name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    pincode: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    properties: Property[];
}

export default function Properties({ properties }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Head title="Properties" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
                        <p className="text-sm text-muted-foreground">Manage your real estate listings and address details.</p>
                    </div>

                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 cursor-pointer shadow-sm">
                                    <Plus className="h-4 w-4" /> Add Property
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Property</DialogTitle>
                                    <DialogDescription>
                                        Fill in the fields below to register a new property location.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form
                                    {...propertiesStore.form()}
                                    options={{
                                        onSuccess: () => {
                                            setOpen(false);
                                        },
                                        preserveScroll: true,
                                    }}
                                    resetOnSuccess={['name', 'address_line_1', 'address_line_2', 'city', 'pincode']}
                                    className="space-y-4 py-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Property Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="e.g. Sunset Heights Apartment"
                                                    required
                                                    autoFocus
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="address_line_1">Address Line 1</Label>
                                                <Input
                                                    id="address_line_1"
                                                    name="address_line_1"
                                                    placeholder="Street name, suite, apt no"
                                                    required
                                                />
                                                <InputError message={errors.address_line_1} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                                                <Input
                                                    id="address_line_2"
                                                    name="address_line_2"
                                                    placeholder="Landmark, locality description"
                                                />
                                                <InputError message={errors.address_line_2} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        placeholder="City name"
                                                        required
                                                    />
                                                    <InputError message={errors.city} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="pincode">Pincode</Label>
                                                    <Input
                                                        id="pincode"
                                                        name="pincode"
                                                        placeholder="postal code"
                                                        required
                                                    />
                                                    <InputError message={errors.pincode} />
                                                </div>
                                            </div>

                                            <DialogFooter className="pt-4 gap-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline" className="cursor-pointer">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={processing} className="cursor-pointer">
                                                    {processing && <Spinner className="mr-2" />}
                                                    Save Property
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {properties.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[350px] border-dashed">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                            <Home className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">No properties yet</CardTitle>
                        <CardDescription className="mt-2 max-w-sm">
                            Get started by creating your first property listing. All registered locations will be listed here.
                        </CardDescription>
                        <Button onClick={() => setOpen(true)} className="mt-4 gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" /> Add Property
                        </Button>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border bg-card shadow-xs">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40 hover:bg-muted/40 font-medium text-muted-foreground select-none">
                                    <TableHead className="px-6 py-4">Name</TableHead>
                                    <TableHead className="px-6 py-4">Address</TableHead>
                                    <TableHead className="px-6 py-4">City</TableHead>
                                    <TableHead className="px-6 py-4">Pincode</TableHead>
                                    <TableHead className="px-6 py-4 text-center">Date Added</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.map((property) => (
                                    <TableRow key={property.id}>
                                        <TableCell className="px-6 py-4 font-semibold text-foreground">{property.name}</TableCell>
                                        <TableCell className="px-6 py-4 text-muted-foreground">
                                            <div>{property.address_line_1}</div>
                                            {property.address_line_2 && (
                                                <div className="text-xs text-muted-foreground/85 mt-0.5">
                                                    {property.address_line_2}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-foreground">{property.city}</TableCell>
                                        <TableCell className="px-6 py-4 text-muted-foreground font-mono">{property.pincode}</TableCell>
                                        <TableCell className="px-6 py-4 text-center text-muted-foreground text-xs">
                                            {new Date(property.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

Properties.layout = {
    breadcrumbs: [
        {
            title: 'Properties',
            href: propertiesIndex(),
        },
    ],
};
