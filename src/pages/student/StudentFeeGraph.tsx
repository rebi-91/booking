import React, { useState, useEffect, CSSProperties } from 'react';
import supabase from '../../supabase';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Spinner, Button, Form } from 'react-bootstrap';
import './StudentFeeGraph.css';
import { useNavigate } from "react-router-dom";

interface StudentData {
  studentID: string;          // <-- Key field in "student" table
  studentName: string;
  className: string;
  section: string;
  totalAmount: number | null;
  [key: string]: any; // for P1..P6, PQ1..PQ3, etc.
}

function StudentFeeGraph() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [studentDetail, setStudentDetail] = useState<StudentData | null>(null);

  // For displaying Fee Summary
  const [amountToPay, setAmountToPay] = useState('1,500,000'); // default fallback

  // Utility: add commas
  const formatFeeValue = (value: string | number) => {
    const numeric = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();
    if (!numeric) return '';
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Utility: remove commas
  const totalWithoutCommas = (str: string) => parseInt(str.replace(/,/g, ''), 10) || 0;

  // Summations
  const sumP = () => {
    if (!studentDetail) return 0;
    let sum = 0;
    for (let i = 1; i <= 6; i++) {
      const val = studentDetail[`P${i}`];
      if (val != null) {
        const numVal = typeof val === 'string' ? parseInt(val.replace(/,/g, ''), 10) : val;
        if (!isNaN(numVal)) sum += numVal;
      }
    }
    return sum;
  };

  const sumPQ = () => {
    if (!studentDetail) return 0;
    let sum = 0;
    for (let i = 1; i <= 3; i++) {
      const val = studentDetail[`PQ${i}`];
      if (val != null) {
        const numVal = typeof val === 'string' ? parseInt(val.replace(/,/g, ''), 10) : val;
        if (!isNaN(numVal)) sum += numVal;
      }
    }
    return sum;
  };

  const combinedTotal = sumP() + sumPQ();
  const amountLeft = studentDetail ? totalWithoutCommas(amountToPay) - combinedTotal : 0;

  // Chart data
  const getFeeDataForChart = () => {
    if (!studentDetail) {
      return { labels: [], datasets: [] };
    }

    const fees: number[] = [];
    const feeLabels: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const val = studentDetail[`P${i}`];
      if (val != null) {
        feeLabels.push(`P${i}`);
        fees.push(val);
      }
    }

    const discounts: number[] = [];
    const discountLabels: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const val = studentDetail[`PQ${i}`];
      if (val != null) {
        discountLabels.push(`Discount ${i}`);
        discounts.push(val);
      }
    }

    return {
      labels: [...feeLabels, ...discountLabels, 'Amount Left'],
      datasets: [
        {
          label: 'Fees',
          data: [...fees, ...Array(discountLabels.length).fill(null), null],
          backgroundColor: '#007bff',
          borderColor: '#64b5f6',
          borderWidth: 1,
          barPercentage: 1.5,
          categoryPercentage: 1.5,
        },
        {
          label: 'Discounts',
          data: [...Array(feeLabels.length).fill(null), ...discounts, null],
          backgroundColor: '#3ecf8e',
          borderColor: '#3ecf8e',
          borderWidth: 1,
          barPercentage: 1.5,
          categoryPercentage: 1.5,
        },
        {
          label: 'Amount Left to Pay',
          data: [...Array(feeLabels.length + discountLabels.length).fill(null), amountLeft],
          backgroundColor: 'red',
          borderColor: 'red',
          borderWidth: 1,
          barPercentage: 1.5,
          categoryPercentage: 1.5,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.8)',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
    },
  };

  // Fetch current user => get school & password => match with studentID & school
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated.');
        }

        // 2. Retrieve from profiles => school and password (which is the StudentID)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('school, password')
          .eq('id', user.id)
          .single();

        if (profileError || !profileData) {
          throw new Error('Failed to retrieve profile information from profiles table.');
        }

        // password in the profiles table = studentID in student table
        const userSchool = profileData.school;
        const userStudentID = profileData.password; // The student's ID is stored in 'password'

        if (!userSchool || !userStudentID) {
          throw new Error('No school or studentID found in profiles for this user.');
        }

        // 3. Fetch from student table: match studentID + school
        //    studentID in student table must match the password value from profiles
        const { data: studentData, error: studentError } = await supabase
          .from('student')
          .select('*')
          .eq('studentID', userStudentID) // The column in 'student' is 'studentID'
          .eq('school', userSchool)
          .single();

        if (studentError) {
          throw new Error(`Error fetching from student table: ${studentError.message}`);
        }
        if (!studentData) {
          throw new Error('No student record found matching that studentID and school.');
        }

        // 4. Set studentDetail
        setStudentDetail(studentData);

        // 5. If student has a custom "totalAmount", use it; else default to 1,500,000
        const amt = studentData.totalAmount != null ? studentData.totalAmount.toString() : '1500000';
        setAmountToPay(formatFeeValue(amt));
      } catch (error: any) {
        console.error('Error:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render Payment Table (READ-ONLY)
  const renderPaymentTable = () => {
    if (!studentDetail) return null;
    const payments = getPaymentRowsToDisplay();

    return (
      <div>
        <div className="d-flex align-items-center justify-content-between header-container">
          {/* Back Button */}
          <button
            className="back-button mb-5"
            onClick={() => navigate("/student")}
            aria-label="Back"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* Header */}
          
          </div>
      <div className="modal-table-container">
        <h3 className="section-heading">Payments</h3>
        <table className="modal-table">
          <thead>
            <tr>
              <th className="modal-th">Payment</th>
              <th className="modal-th">Date</th>
              <th className="modal-th">Reference No</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.index}>
                <td className="modal-td">
                  {payment.P != null ? formatFeeValue(payment.P.toString()) : '---'}
                </td>
                <td className="modal-td">
                  {payment.D ? new Date(payment.D).toLocaleDateString() : '---'}
                </td>
                <td className="modal-td">
                  {payment.R || '---'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
  };

  // Render Discount Table (READ-ONLY)
  const renderDiscountTable = () => {
    if (!studentDetail) return null;
    const discounts = getDiscountRowsToDisplay();

    return (
      <div className="modal-table-container">
        <h3 className="section-heading">Discounts</h3>
        <table className="modal-table">
          <thead>
            <tr>
              <th className="modal-th">Discount</th>
              <th className="modal-th">Date</th>
              <th className="modal-th">Reason</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.index}>
                <td className="modal-td">
                  {discount.PQ != null ? formatFeeValue(discount.PQ.toString()) : '---'}
                </td>
                <td className="modal-td">
                  {discount.DQ ? new Date(discount.DQ).toLocaleDateString() : '---'}
                </td>
                <td className="modal-td">
                  {discount.RQ || '---'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Construct Payment Rows
  const getPaymentRowsToDisplay = () => {
    if (!studentDetail) return [];
    let filledRows: number[] = [];
    for (let i = 1; i <= 6; i++) {
      const P = studentDetail[`P${i}`];
      const D = studentDetail[`D${i}`];
      const R = studentDetail[`R${i}`];
      if (P != null || D != null || R != null) {
        filledRows.push(i);
      }
    }
    // At least 1 row so user sees structure
    if (filledRows.length === 0) {
      filledRows = [1];
    }
    return filledRows.map((i) => ({
      index: i,
      P: studentDetail[`P${i}`] || null,
      D: studentDetail[`D${i}`] || null,
      R: studentDetail[`R${i}`] || null,
    }));
  };

  // Construct Discount Rows
  const getDiscountRowsToDisplay = () => {
    if (!studentDetail) return [];
    let filledRows: number[] = [];
    for (let i = 1; i <= 3; i++) {
      const PQ = studentDetail[`PQ${i}`];
      const DQ = studentDetail[`DQ${i}`];
      const RQ = studentDetail[`RQ${i}`];
      if (PQ != null || DQ != null || RQ != null) {
        filledRows.push(i);
      }
    }
    // At least 1 row so user sees structure
    if (filledRows.length === 0) {
      filledRows = [1];
    }
    return filledRows.map((i) => ({
      index: i,
      PQ: studentDetail[`PQ${i}`] || null,
      DQ: studentDetail[`DQ${i}`] || null,
      RQ: studentDetail[`RQ${i}`] || null,
    }));
  };

  // UI
  if (isLoading) {
    return (
      <div className="student-fee-graph-container">
        <div style={{ textAlign: 'center', color: '#fff', fontSize: '18px' }}>
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!studentDetail) {
    return (
      <div className="student-fee-graph-container">
        <h2 style={{ color: '#fff', textAlign: 'center' }}>No student details found.</h2>
      </div>
    );
  }

  return (
    <div className="student-fee-graph-container">
      <h2 className="page-title">{studentDetail.studentName}</h2>
      <p className="class-section">
        {studentDetail.className} - {studentDetail.section}
      </p>
      
      <div className="fee-summary">
  <p>
    <strong style={{ fontSize: '28px', margin: '0 5px' }}> IQD{formatFeeValue(sumP().toString())} Paid </strong>
    <span className="discount-amount">
      {' '}
      <span style={{ fontSize: '24px', margin: '0 5px' }}>+</span>
      IQD{formatFeeValue(sumPQ().toString())} Discount
    </span>
    <span style={{ fontSize: '28px', margin: '0 5px' }}>
    {' '}= 
    </span>
    {' '} IQD{formatFeeValue(combinedTotal.toString())}
    <span className="amount-left">
      {' '}
      <span style={{ fontSize: '24px', margin: '0 5px' }}>+</span>
      <span style={{ fontSize: '32px', margin: '0 5px' }}>
      IQD{formatFeeValue(amountLeft.toString())} left
      </span>
    </span>
  </p>
</div>


      {renderPaymentTable()}
      {renderDiscountTable()}

      {/* The user's totalAmount or default 1,500,000 displayed */}
      <div className="amount-to-pay-section">
        <Form.Label style={{ color: '#fff' }}><strong>Amount to Pay (Target):</strong></Form.Label>
        <Form.Control
          type="text"
          readOnly
          value={amountToPay}
          style={{ maxWidth: '200px', backgroundColor: '#555', color: '#fff', border: '1px solid #555' }}
        />
      </div>

      {/* Chart Section */}
      <div style={{ marginTop: '30px' }}>
        <h3 className="section-heading">Fee Distribution</h3>
        <div style={{ height: '400px' }}>
          <Bar data={getFeeDataForChart()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
  
}

export default StudentFeeGraph;
