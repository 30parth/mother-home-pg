import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { Plus, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { PropertySelect } from '@/components/property-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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

import { index as receiptsIndex, store as receiptsStore } from '@/routes/receipts';

interface Property {
    id: number;
    name: string;
}

interface PaymentReceipt {
    id: number;
    date: string;
    property_id: number;
    payment_mode: 'cash' | 'online' | 'other';
    student_name: string;
    room_number: string | null;
    month: string;
    security_deposit: string;
    electricity_deposit: string;
    advance_rent: string;
    total: string;
    received_by: string;
    created_at: string;
    property: Property;
}

interface Props {
    receipts: PaymentReceipt[];
    properties: Property[];
}

export default function Receipts({ receipts, properties }: Props) {
    const [open, setOpen] = useState(false);
    const [propertyId, setPropertyId] = useState<string>('');
    const [paymentMode, setPaymentMode] = useState<string>('cash');
    const [securityDeposit, setSecurityDeposit] = useState<number>(0);
    const [electricityDeposit, setElectricityDeposit] = useState<number>(0);
    const [advanceRent, setAdvanceRent] = useState<number>(0);

    const calculatedTotal = securityDeposit + electricityDeposit + advanceRent;

    return (
        <>
            <Head title="Payment Receipts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Payment Receipts</h1>
                        <p className="text-sm text-muted-foreground">Issue and manage tenant rent and deposit payment receipts.</p>
                    </div>

                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 cursor-pointer shadow-sm">
                                    <Plus className="h-4 w-4" /> Issue Receipt
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px]">
                                <DialogHeader>
                                    <DialogTitle>Issue Payment Receipt</DialogTitle>
                                    <DialogDescription>
                                        Fill in receipt details. Ashok Golani is the default receiver.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form
                                    {...receiptsStore.form()}
                                    onSuccess={() => {
                                        setOpen(false);
                                        // Reset local form states
                                        setPropertyId('');
                                        setPaymentMode('cash');
                                        setSecurityDeposit(0);
                                        setElectricityDeposit(0);
                                        setAdvanceRent(0);
                                    }}
                                    options={{
                                        preserveScroll: true,
                                    }}
                                    resetOnSuccess={[
                                        'date',
                                        'property_id',
                                        'payment_mode',
                                        'student_name',
                                        'room_number',
                                        'month',
                                        'security_deposit',
                                        'electricity_deposit',
                                        'advance_rent',
                                        'received_by',
                                    ]}
                                    className="space-y-4 py-2"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="date">Receipt Date</Label>
                                                    <Input
                                                        id="date"
                                                        name="date"
                                                        type="date"
                                                        required
                                                        defaultValue={new Date().toISOString().split('T')[0]}
                                                    />
                                                    <InputError message={errors.date} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="month">Rent Month</Label>
                                                    <Input
                                                        id="month"
                                                        name="month"
                                                        placeholder="e.g. June 2026"
                                                        required
                                                    />
                                                    <InputError message={errors.month} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="property_id">Property</Label>
                                                    <PropertySelect
                                                        properties={properties}
                                                        value={propertyId}
                                                        onValueChange={setPropertyId}
                                                        name="property_id"
                                                        error={errors.property_id}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="payment_mode">Payment Mode</Label>
                                                    <Select
                                                        value={paymentMode}
                                                        onValueChange={setPaymentMode}
                                                        name="payment_mode"
                                                    >
                                                        <SelectTrigger className="w-full border-input text-left">
                                                            <SelectValue placeholder="Select mode" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="cash">Cash</SelectItem>
                                                            <SelectItem value="online">Online</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors.payment_mode} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-2 grid gap-2">
                                                    <Label htmlFor="student_name">Student Name</Label>
                                                    <Input
                                                        id="student_name"
                                                        name="student_name"
                                                        placeholder="Full name of student"
                                                        required
                                                    />
                                                    <InputError message={errors.student_name} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="room_number">Room No (Opt)</Label>
                                                    <Input
                                                        id="room_number"
                                                        name="room_number"
                                                        placeholder="e.g. 104-B"
                                                    />
                                                    <InputError message={errors.room_number} />
                                                </div>
                                            </div>

                                            <div className="border-t border-border pt-3 mt-2">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Particulars</span>
                                                
                                                <div className="grid grid-cols-3 gap-4 mt-2">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="security_deposit">Security (₹)</Label>
                                                        <Input
                                                            id="security_deposit"
                                                            name="security_deposit"
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            defaultValue="0"
                                                            onChange={(e) => setSecurityDeposit(parseFloat(e.target.value) || 0)}
                                                        />
                                                        <InputError message={errors.security_deposit} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="electricity_deposit">Electricity (₹)</Label>
                                                        <Input
                                                            id="electricity_deposit"
                                                            name="electricity_deposit"
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            defaultValue="0"
                                                            onChange={(e) => setElectricityDeposit(parseFloat(e.target.value) || 0)}
                                                        />
                                                        <InputError message={errors.electricity_deposit} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="advance_rent">Adv Rent (₹)</Label>
                                                        <Input
                                                            id="advance_rent"
                                                            name="advance_rent"
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            defaultValue="0"
                                                            onChange={(e) => setAdvanceRent(parseFloat(e.target.value) || 0)}
                                                        />
                                                        <InputError message={errors.advance_rent} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
                                                <span className="text-sm font-semibold text-foreground">Total Sum:</span>
                                                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₹{calculatedTotal.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="received_by">Received By</Label>
                                                <Input
                                                    id="received_by"
                                                    name="received_by"
                                                    placeholder="Ashok Golani"
                                                    defaultValue="Ashok Golani"
                                                />
                                                <InputError message={errors.received_by} />
                                            </div>

                                            <DialogFooter className="pt-2 gap-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline" className="cursor-pointer">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={processing} className="cursor-pointer">
                                                    {processing && <Spinner className="mr-2" />}
                                                    Issue Receipt
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {receipts.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[350px] border-dashed">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                            <FileText className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">No receipts issued yet</CardTitle>
                        <CardDescription className="mt-2 max-w-sm">
                            Get started by issuing your first tenant payment receipt. All records will be listed here.
                        </CardDescription>
                        <Button onClick={() => setOpen(true)} className="mt-4 gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" /> Issue Receipt
                        </Button>
                    </Card>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border bg-card shadow-xs">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40 hover:bg-muted/40 font-medium text-muted-foreground select-none">
                                    <TableHead className="px-4 py-3">Student</TableHead>
                                    <TableHead className="px-4 py-3">Property</TableHead>
                                    <TableHead className="px-4 py-3">Room / Month</TableHead>
                                    <TableHead className="px-4 py-3 text-center">Payment Mode</TableHead>
                                    <TableHead className="px-4 py-3 text-right">Particulars</TableHead>
                                    <TableHead className="px-4 py-3 text-right">Total</TableHead>
                                    <TableHead className="px-4 py-3 text-center">Date</TableHead>
                                    <TableHead className="px-4 py-3">Received By</TableHead>
                                    <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {receipts.map((receipt) => (
                                    <TableRow key={receipt.id}>
                                        <TableCell className="px-4 py-3 font-semibold text-foreground">
                                            {receipt.student_name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            {receipt.property?.name || 'Unknown Property'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div>{receipt.room_number ? `Room ${receipt.room_number}` : '-'}</div>
                                            <div className="text-xs text-muted-foreground">{receipt.month}</div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center capitalize">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border">
                                                {receipt.payment_mode}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right text-xs text-muted-foreground">
                                            <div>Sec: ₹{parseFloat(receipt.security_deposit).toFixed(2)}</div>
                                            <div>Elec: ₹{parseFloat(receipt.electricity_deposit).toFixed(2)}</div>
                                            <div>Adv: ₹{parseFloat(receipt.advance_rent).toFixed(2)}</div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                            ₹{parseFloat(receipt.total).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center text-muted-foreground text-xs">
                                            {new Date(receipt.date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground text-sm">
                                            {receipt.received_by}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="cursor-pointer gap-1.5"
                                                asChild
                                            >
                                                <a href={`/receipts/${receipt.id}/download`} target="_blank" rel="noreferrer">
                                                    <FileText className="h-4 w-4" /> PDF
                                                </a>
                                            </Button>
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

Receipts.layout = {
    breadcrumbs: [
        {
            title: 'Payment Receipts',
            href: receiptsIndex(),
        },
    ],
};
