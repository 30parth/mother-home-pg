import { Head, Link } from '@inertiajs/react';
import { Home, Users, AlertCircle, FileText, ArrowRight, Phone, TrendingUp, CheckCircle, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';

interface Property {
    id: number;
    name: string;
}

interface Student {
    id: number;
    name: string;
    month_rent: string;
    contact_no: string;
    due_date: number | null;
    days_overdue?: number;
    amount_due?: number;
    property?: Property | null;
}

interface PaymentReceipt {
    id: number;
    date: string;
    student_name: string;
    month: string;
    payment_mode: string;
    total: string;
    property?: Property | null;
}

interface Props {
    stats: {
        total_properties: number;
        total_students: number;
        overdue_count: number;
        current_month_collections: number;
        current_month_name: string;
    };
    overdue_students: Student[];
    recent_receipts: PaymentReceipt[];
}

function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

export default function Dashboard({ stats, overdue_students, recent_receipts }: Props) {
    const formatCurrency = (amount: number | string) => {
        const parsed = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(parsed);
    };

    const getWhatsAppUrl = (phone: string, studentName: string, amount: string) => {
        const cleaned = phone.replace(/[^0-9]/g, '');
        const finalPhone = cleaned.length === 10 ? `91${cleaned}` : cleaned;
        const text = encodeURIComponent(
            `Hi ${studentName}, this is a gentle reminder regarding your monthly rent payment of ${formatCurrency(amount)}. Please clear it at your earliest convenience. Thank you!`
        );
        return `https://wa.me/${finalPhone}?text=${text}`;
    };

    const hasOverdue = stats.overdue_count > 0;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Real-time overview of properties, tenants, and monthly financials.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Total Properties</span>
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Home className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total_properties}</div>
                            <p className="text-xs text-muted-foreground mt-1">Registered locations</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Active Students</span>
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total_students}</div>
                            <p className="text-xs text-muted-foreground mt-1">Tenant profiles</p>
                        </CardContent>
                    </Card>

                    <Card className={`transition-all ${hasOverdue ? 'border-destructive bg-destructive/5 dark:bg-destructive/10' : 'hover:shadow-md'}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Overdue Rent</span>
                            <div className={`p-2 rounded-lg ${hasOverdue ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                                <AlertCircle className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${hasOverdue ? 'text-destructive' : 'text-foreground'}`}>
                                {stats.overdue_count}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {hasOverdue ? 'Requires immediate contact' : 'All clear for this month'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Collections ({stats.current_month_name})</span>
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(stats.current_month_collections)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Total revenue collected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Dashboard Lists */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Overdue Rent List - Takes 2 cols */}
                    <Card className="lg:col-span-2 shadow-xs">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Overdue Rent Alerts</CardTitle>
                                    <CardDescription>Students whose rent due day has passed without a receipt for this month.</CardDescription>
                                </div>
                                {hasOverdue && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/15 text-destructive border border-destructive/20 animate-pulse">
                                        Action Required
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {!hasOverdue ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <CheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
                                    <h3 className="text-base font-semibold text-foreground">All Clear!</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mt-1">
                                        All students have paid their rent or are not yet past their rent due dates.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/40 hover:bg-muted/40 font-medium select-none">
                                                <TableHead className="px-6 py-3">Student</TableHead>
                                                <TableHead className="px-6 py-3">Property</TableHead>
                                                <TableHead className="px-6 py-3 text-center">Due Day</TableHead>
                                                <TableHead className="px-6 py-3 text-center">Days Late</TableHead>
                                                <TableHead className="px-6 py-3 text-right">Rent Due</TableHead>
                                                <TableHead className="px-6 py-3 text-right">Contact</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {overdue_students.map((student) => (
                                                <TableRow key={student.id} className="hover:bg-muted/30">
                                                    <TableCell className="px-6 py-3.5 font-semibold text-foreground">
                                                        {student.name}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3.5 text-sm text-muted-foreground">
                                                        {student.property?.name || '-'}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3.5 text-center font-medium text-sm text-foreground">
                                                        {student.due_date ? `${student.due_date}${getOrdinalSuffix(student.due_date)}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3.5 text-center text-sm font-bold text-destructive">
                                                        {student.days_overdue}d
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3.5 text-right font-bold text-foreground">
                                                        {formatCurrency(student.amount_due ?? student.month_rent)}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3.5 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={getWhatsAppUrl(student.contact_no, student.name, student.month_rent)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    title="Send WhatsApp Reminder"
                                                                >
                                                                    <MessageSquare className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-muted-foreground"
                                                                asChild
                                                            >
                                                                <a href={`tel:${student.contact_no}`} title="Call Tenant">
                                                                    <Phone className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Receipts List - Takes 1 col */}
                    <Card className="shadow-xs">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Recent Receipts</CardTitle>
                                    <CardDescription>Latest rent receipts generated.</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-semibold px-2" asChild>
                                    <Link href="/receipts">
                                        View All <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recent_receipts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <FileText className="h-10 w-10 text-muted-foreground/60 mb-2" />
                                    <h3 className="text-sm font-semibold text-muted-foreground">No receipts</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Issue payment receipts to populate this list.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/40">
                                    {recent_receipts.map((receipt) => (
                                        <div key={receipt.id} className="flex items-center justify-between p-4 hover:bg-muted/20">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-foreground truncate max-w-[150px]">
                                                    {receipt.student_name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {receipt.property?.name || 'Unknown Property'} • <span className="font-semibold">{receipt.month}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatCurrency(receipt.total)}
                                                    </span>
                                                    <div className="text-[10px] text-muted-foreground capitalize">
                                                        via {receipt.payment_mode}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-muted"
                                                    asChild
                                                >
                                                    <a href={`/receipts/${receipt.id}/download`} target="_blank" rel="noreferrer" title="Download PDF">
                                                        <FileText className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
