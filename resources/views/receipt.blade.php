<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Payment Receipt</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333333;
        }

        .receipt {
            border: 3px solid #2f2b74;
            border-radius: 12px;
            overflow: hidden;
            background: #ffffff;
        }

        /* Header */
        .company-header {
            width: 100%;
            border-collapse: collapse;
            background: #2f2b74;
            margin: 0;
        }

        .company-info {
            padding: 25px;
            color: #ffffff;
            vertical-align: middle;
        }

        .company-name {
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .company-tagline {
            font-size: 13px;
            opacity: 0.95;
            margin-bottom: 4px;
        }

        .company-address {
            font-size: 12px;
            opacity: 0.90;
            margin-bottom: 2px;
        }

        .company-phone {
            font-size: 12px;
            opacity: 0.90;
        }

        .header-red-block {
            width: 100px;
            background-color: #d53d3d;
        }

        /* Title */
        .title {
            text-align: center;
            padding: 12px;
            background: #d53d3d;
            color: #ffffff;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        /* Section */
        .section {
            padding: 25px;
        }

        /* Info Grid */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .info-box {
            border: 1px solid #dcdcdc;
            padding: 10px 12px;
            border-radius: 6px;
            background: #fafafa;
        }

        .label {
            color: #2f2b74;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 500;
        }

        /* Particulars Table */
        .particulars-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .particulars-table th {
            background: #2f2b74;
            color: #ffffff;
            padding: 12px;
            font-size: 13px;
            font-weight: bold;
        }

        .particulars-table td {
            padding: 12px;
            border: 1px solid #dddddd;
            font-size: 13px;
            color: #333333;
        }

        .total-row td {
            background: #d53d3d;
            color: #ffffff;
            font-weight: bold;
            border: 1px solid #d53d3d;
            font-size: 14px;
        }

        /* Footer */
        .footer {
            padding: 0 25px 25px 25px;
        }

        .amount-box {
            background: #edf2ff;
            border-left: 5px solid #2f2b74;
            padding: 12px 15px;
            margin-bottom: 25px;
            font-size: 13px;
            color: #2f2b74;
        }

        .amount-box strong {
            font-weight: bold;
        }

        .signatures-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 35px;
        }

        .sign-cell {
            text-align: center;
            vertical-align: bottom;
        }

        .sign-line {
            border-top: 2px solid #333333;
            width: 180px;
            margin: 0 auto 8px auto;
        }

        .sign-label {
            font-size: 13px;
            font-weight: bold;
            color: #333333;
        }

        .sign-name {
            font-size: 11px;
            color: #666666;
            margin-top: 2px;
        }

        .note {
            text-align: center;
            color: #666666;
            font-size: 12px;
            margin-top: 25px;
        }
    </style>
</head>
<body>

<div class="receipt">

    <!-- Header -->
    <table class="company-header">
        <tr>
            <td class="company-info">
                <div class="company-name">{{ $receipt->property->name }}</div>
                <div class="company-tagline">Luxurious Hostel / PG for Students</div>
                <div class="company-address">
                    {{ $receipt->property->address_line_1 }}@if($receipt->property->address_line_2), {{ $receipt->property->address_line_2 }}@endif, {{ $receipt->property->city }} - {{ $receipt->property->pincode }}
                </div>
                <div class="company-phone">Phone: 9825222455 | 9428682122</div>
            </td>
            <td class="header-red-block"></td>
        </tr>
    </table>

    <!-- Receipt Title -->
    <div class="title">
        PAYMENT RECEIPT
    </div>

    <div class="section">
        <!-- Info Grid -->
        <table class="info-table">
            <tr>
                <td style="width: 50%; padding-right: 8px; padding-bottom: 12px; border: none;">
                    <div class="info-box">
                        <div class="label">Receipt No.</div>
                        <div class="value">MH-{{ $receipt->date->format('Y') }}-{{ str_pad($receipt->id, 4, '0', STR_PAD_LEFT) }}</div>
                    </div>
                </td>
                <td style="width: 50%; padding-left: 8px; padding-bottom: 12px; border: none;">
                    <div class="info-box">
                        <div class="label">Date</div>
                        <div class="value">{{ $receipt->date->format('d F Y') }}</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="width: 50%; padding-right: 8px; border: none;">
                    <div class="info-box">
                        <div class="label">Student Name</div>
                        <div class="value">{{ $receipt->student_name }}</div>
                    </div>
                </td>
                <td style="width: 50%; padding-left: 8px; border: none;">
                    <div class="info-box">
                        <div class="label">Room No.</div>
                        <div class="value">{{ $receipt->room_number ?? '-' }}</div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Particulars Table -->
        <table class="particulars-table">
            <thead>
                <tr>
                    <th style="text-align: left;">Description</th>
                    <th style="text-align: center; width: 120px;">Month</th>
                    <th style="text-align: right; width: 150px;">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $hasRows = false;
                @endphp

                @if($receipt->security_deposit > 0)
                    <tr>
                        <td style="text-align: left;">Security Deposit</td>
                        <td style="text-align: center;">{{ $receipt->month }}</td>
                        <td style="text-align: right;">{{ number_format($receipt->security_deposit, 2) }}</td>
                    </tr>
                    @php $hasRows = true; @endphp
                @endif

                @if($receipt->electricity_deposit > 0)
                    <tr>
                        <td style="text-align: left;">Electricity Charges</td>
                        <td style="text-align: center;">{{ $receipt->month }}</td>
                        <td style="text-align: right;">{{ number_format($receipt->electricity_deposit, 2) }}</td>
                    </tr>
                    @php $hasRows = true; @endphp
                @endif

                @if($receipt->advance_rent > 0)
                    <tr>
                        <td style="text-align: left;">PG Accommodation Fee / Advance Rent</td>
                        <td style="text-align: center;">{{ $receipt->month }}</td>
                        <td style="text-align: right;">{{ number_format($receipt->advance_rent, 2) }}</td>
                    </tr>
                    @php $hasRows = true; @endphp
                @endif

                @if(!$hasRows)
                    <tr>
                        <td style="text-align: left;">Rent / Deposit Particulars</td>
                        <td style="text-align: center;">{{ $receipt->month }}</td>
                        <td style="text-align: right;">0.00</td>
                    </tr>
                @endif

                <tr class="total-row">
                    <td colspan="2" style="text-align: right; font-weight: bold; border-right: none;">TOTAL PAID</td>
                    <td style="text-align: right; font-weight: bold; border-left: none;">₹ {{ number_format($receipt->total, 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="amount-box">
            <strong>Amount in Words:</strong><br>
            {{ $receipt->total_in_words }}
        </div>

        <table class="signatures-table">
            <tr>
                <td class="sign-cell" style="width: 45%; border: none;">
                    <div class="sign-line"></div>
                    <div class="sign-label">Student Signature</div>
                </td>
                <td style="width: 10%; border: none;">&nbsp;</td>
                <td class="sign-cell" style="width: 45%; border: none;">
                    <div class="sign-line"></div>
                    <div class="sign-label">Authorized Signature</div>
                    <div class="sign-name">({{ $receipt->received_by }})</div>
                </td>
            </tr>
        </table>

        <div class="note">
            Thank you for choosing {{ $receipt->property->name }}.
        </div>
    </div>

</div>

</body>
</html>
