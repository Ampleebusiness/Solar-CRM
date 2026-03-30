import React, { useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import {
  CRM_DUMMY_CUSTOMERS,
  CRM_PROGRESS_STEPS,
  CRM_STATUS_BADGE_CLASS,
  getCompletedStepIndexByStatus,
} from '../../data/sellerCrmCustomers';

const TABS = ['Lead Info', 'Site Survey', 'Proposal', 'Installation', 'Documents'];

function Stepper({ status }) {
  const doneIdx = getCompletedStepIndexByStatus(status);
  return (
    <div className="seller-crm-stepper" role="list">
      {CRM_PROGRESS_STEPS.map((label, idx) => {
        const done = idx <= doneIdx;
        return (
          <div key={label} className={done ? 'seller-crm-step is-done' : 'seller-crm-step'} role="listitem">
            <div className="seller-crm-step__dot" aria-hidden>
              {done ? <i className="fa fa-check" /> : <span />}
            </div>
            <div className="seller-crm-step__label">{label}</div>
            {idx !== CRM_PROGRESS_STEPS.length - 1 && <div className="seller-crm-step__line" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}

export default function SellerCustomerView() {
  const { id } = useParams();
  const [tab, setTab] = useState(TABS[0]);

  const customer = useMemo(() => CRM_DUMMY_CUSTOMERS.find((c) => c.id === id) || null, [id]);

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
        <SellerDashboardLayout>
          <div className="seller-crm-content seller-crm-content--flush">
            <div className="seller-crm-panel-head seller-crm-panel-head--table">
              <h2 className="seller-crm-panel-title">Customer</h2>
              <NavLink to="/seller-customers" className="seller-crm-btn-outline">
                <i className="fa fa-arrow-left m-r8" aria-hidden />
                Back
              </NavLink>
            </div>

            {!customer ? (
              <div className="seller-table__empty">Customer not found.</div>
            ) : (
              <>
                <div className="seller-crm-card seller-crm-card--top">
                  <div className="seller-crm-cust-top">
                    <div className="seller-crm-cust-top__left">
                      <div className="seller-crm-cust-name">{customer.name}</div>
                      <div className="seller-crm-cust-sub">
                        <span>
                          <i className="fa fa-phone m-r8" aria-hidden /> {customer.phone}
                        </span>
                        <span className="seller-crm-dot-sep" aria-hidden>
                          •
                        </span>
                        <span>
                          <i className="fa fa-map-marker m-r8" aria-hidden /> {customer.city}
                        </span>
                      </div>
                    </div>

                    <div className="seller-crm-cust-top__right">
                      <div className="seller-crm-kpi">
                        <div className="seller-crm-kpi__k">System Size</div>
                        <div className="seller-crm-kpi__v">{customer.systemSize}</div>
                      </div>
                      <div className="seller-crm-kpi">
                        <div className="seller-crm-kpi__k">Status</div>
                        <div className="seller-crm-kpi__v">
                          <span className={CRM_STATUS_BADGE_CLASS[customer.status] || 'seller-crm-status'}>
                            {customer.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="seller-crm-cust-meta">
                    <div>
                      <div className="seller-crm-k">Address</div>
                      <div className="seller-crm-v">{customer.address}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Assigned Staff</div>
                      <div className="seller-crm-v">{customer.assignedStaff}</div>
                    </div>
                  </div>
                </div>

                <div className="seller-crm-card m-t20">
                  <div className="seller-crm-card__head">
                    <div className="seller-crm-card__title">Progress tracker</div>
                  </div>
                  <div className="seller-crm-card__body">
                    <Stepper status={customer.status} />
                  </div>
                </div>

                <div className="seller-crm-card m-t20">
                  <div className="seller-crm-tabs">
                    {TABS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={t === tab ? 'seller-crm-tab is-active' : 'seller-crm-tab'}
                        onClick={() => setTab(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="seller-crm-card__body">
                    {tab === 'Lead Info' && (
                      <div className="seller-crm-dummy">
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Lead source</div>
                          <div className="seller-crm-v">Website enquiry</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Notes</div>
                          <div className="seller-crm-v seller-crm-v--desc">
                            Customer requested a callback and basic ROI estimate. (Demo content)
                          </div>
                        </div>
                      </div>
                    )}

                    {tab === 'Site Survey' && (
                      <div className="seller-crm-dummy">
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Survey date</div>
                          <div className="seller-crm-v">—</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Roof type</div>
                          <div className="seller-crm-v">RCC</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Observations</div>
                          <div className="seller-crm-v seller-crm-v--desc">
                            Shade check and mounting points to be confirmed. (Demo content)
                          </div>
                        </div>
                      </div>
                    )}

                    {tab === 'Proposal' && (
                      <div className="seller-crm-dummy">
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Proposal version</div>
                          <div className="seller-crm-v">v1</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Estimated savings</div>
                          <div className="seller-crm-v">₹ 2,500 / month</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Message</div>
                          <div className="seller-crm-v seller-crm-v--desc">
                            Shared proposal PDF on WhatsApp & email. (Demo content)
                          </div>
                        </div>
                      </div>
                    )}

                    {tab === 'Installation' && (
                      <div className="seller-crm-dummy">
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Start date</div>
                          <div className="seller-crm-v">—</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Team</div>
                          <div className="seller-crm-v">2 technicians</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Updates</div>
                          <div className="seller-crm-v seller-crm-v--desc">
                            Wiring + inverter placement in progress. (Demo content)
                          </div>
                        </div>
                      </div>
                    )}

                    {tab === 'Documents' && (
                      <div className="seller-crm-dummy">
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">KYC</div>
                          <div className="seller-crm-v">Pending</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Net metering</div>
                          <div className="seller-crm-v">In review</div>
                        </div>
                        <div className="seller-crm-dummy__row">
                          <div className="seller-crm-k">Attachments</div>
                          <div className="seller-crm-v seller-crm-v--desc">Upload UI can be added later. (Demo content)</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </SellerDashboardLayout>
      </div>
      <Footer2 />
    </>
  );
}

