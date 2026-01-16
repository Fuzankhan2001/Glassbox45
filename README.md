# GlassBox 45

**Trust through Transparency.**

GlassBox 45 is a next-generation NGO management platform designed to bridge the trust gap between donors and charitable organizations. It replaces opaque financial reporting with real-time, traceable tracking for donations, ensuring financial discipline through code-enforced compliance.

**Status:** Hackathon Prototype | **Stack:** React, Vite, Tailwind CSS

---

## Problem Statement
Donors often hesitate to contribute to charitable causes due to a lack of visibility regarding fund utilization. Common concerns include:
* Uncertainty about whether funds are used for the intended purpose or administrative overhead.
* Lack of verification regarding vendor legitimacy.
* Delays in receiving tax exemption certificates (e.g., 80G).

## Solution
GlassBox 45 implements a dual-interface system (Donor & Admin) that enforces financial discipline. It introduces "Restricted Funds" at a software level, preventing the misuse of specific donations for unrelated expenses.

### Key Features

#### 1. Expense Lockbox (Admin Portal)
The core compliance engine designed to prevent fund mismanagement.
* **Strict Fund Isolation:** Funds donated for specific causes (e.g., Education) are programmatically locked and cannot be used for other categories (e.g., Medical Supplies or Admin Overhead).
* **AI Bill Scanning:** Utilizes **Tesseract.js** (OCR) to parse vendor invoices and automatically populate payment details, reducing manual entry errors.
* **Vendor Verification:** Includes a prototype GSTIN validation system to ensure payments are only released to legitimate, verified vendors.

#### 2. Impact Timeline (Donor Portal)
* **Lifecycle Tracking:** Provides donors with a granular view of their contribution's journey.
    * Stage 1: Donation Received
    * Stage 2: Allocation to Project
    * Stage 3: Vendor Payment (with Invoice Proof)
    * Stage 4: Impact Delivered (with Photo Proof)

#### 3. Instant Tax Compliance
* **Automated Certificates:** Donors receive valid, downloadable 80G Tax Exemption certificates immediately upon successful payment processing.

#### 4. Live Admin Dashboard
* **Real-Time Analytics:** Provides a live stream of income versus expenses.
* **Fund Balance Tracking:** Visualizes the separation between Restricted and Unrestricted fund balances.

---

## Technical Stack

* **Frontend Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **OCR Engine:** Tesseract.js (Client-side image processing)
* **State Management:** React Hooks + LocalStorage (Persisted demo data)

## Usage Guide (Demo Workflow)

### 1. The Donor Experience
* Log in using the Donor Portal.
* Navigate to **"Make a Contribution"** and donate a specific amount (e.g., 5,000 INR) to a restricted cause like "Vidya Shakti (Education)".
* Download the generated Receipt.
* Visit the **"Impact Timeline"** to view the status of the donation and how it is being utilized.

### 2. The Admin Experience
* Log out and sign in via the **Staff/Admin Login**.
* Navigate to the **"Expense Lockbox"**.
* Upload a sample bill image or verify a Vendor GSTIN manually using the input field.
* Attempt to pay for an unrelated category (e.g., "Medical Supplies") using the "Education Fund" to demonstrate the blocking mechanism.
* Navigate to the **"Impact Timeline"** tab to upload "Proof of Work" photos, which updates the donor's view.
