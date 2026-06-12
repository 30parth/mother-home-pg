import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { Plus, Package } from 'lucide-react';

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

import { index as productsIndex, store as productsStore } from '@/routes/products';

interface Product {
    id: number;
    name: string;
    price: string;
    description: string | null;
    sales_rate: string;
    purchase_rate: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    products: Product[];
}

export default function Products({ products }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                        <p className="text-sm text-muted-foreground">Manage your product catalog, prices, and transaction rates.</p>
                    </div>

                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 cursor-pointer shadow-sm">
                                    <Plus className="h-4 w-4" /> Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Product</DialogTitle>
                                    <DialogDescription>
                                        Fill in the fields below to register a new product.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form
                                    {...productsStore.form()}
                                    options={{
                                        onSuccess: () => {
                                            setOpen(false);
                                        },
                                        preserveScroll: true,
                                    }}
                                    resetOnSuccess={['name', 'price', 'description', 'sales_rate', 'purchase_rate']}
                                    className="space-y-4 py-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Product Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="e.g. Cotton Bed Sheets"
                                                    required
                                                    autoFocus
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="price">Base Price ($)</Label>
                                                <Input
                                                    id="price"
                                                    name="price"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    required
                                                />
                                                <InputError message={errors.price} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="sales_rate">Sales Rate ($)</Label>
                                                    <Input
                                                        id="sales_rate"
                                                        name="sales_rate"
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                    <InputError message={errors.sales_rate} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="purchase_rate">Purchase Rate ($)</Label>
                                                    <Input
                                                        id="purchase_rate"
                                                        name="purchase_rate"
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                    <InputError message={errors.purchase_rate} />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="description">Description (Optional)</Label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    rows={3}
                                                    placeholder="Product specifications and details..."
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                                                />
                                                <InputError message={errors.description} />
                                            </div>

                                            <DialogFooter className="pt-4 gap-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline" className="cursor-pointer">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={processing} className="cursor-pointer">
                                                    {processing && <Spinner className="mr-2" />}
                                                    Save Product
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {products.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[350px] border-dashed">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                            <Package className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">No products yet</CardTitle>
                        <CardDescription className="mt-2 max-w-sm">
                            Get started by creating your first product. All registered products will be listed here.
                        </CardDescription>
                        <Button onClick={() => setOpen(true)} className="mt-4 gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" /> Add Product
                        </Button>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border bg-card shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm text-foreground">
                                <thead>
                                    <tr className="border-b border-sidebar-border bg-muted/40 font-medium text-muted-foreground select-none">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 text-right">Base Price</th>
                                        <th className="px-6 py-4 text-right">Sales Rate</th>
                                        <th className="px-6 py-4 text-right">Purchase Rate</th>
                                        <th className="px-6 py-4 text-center">Date Added</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border">
                                    {products.map((product) => (
                                        <tr key={product.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-6 py-4 font-semibold text-foreground">{product.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground max-w-xs truncate" title={product.description || ''}>
                                                {product.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium">
                                                ${parseFloat(product.sales_rate).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-destructive">
                                                ${parseFloat(product.purchase_rate).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center text-muted-foreground text-xs">
                                                {new Date(product.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Products.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: productsIndex(),
        },
    ],
};
