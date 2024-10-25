import React, { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    const initPhonePrefixToggler = () => {
      const wrapper = document.getElementById('phones-prefix-range-wrapper');
      const checkbox = document.getElementById('phones-include-prefix');
      const input = document.getElementById('phones-prefix-range');

      checkbox.addEventListener('change', function (e) {
        wrapper.classList.toggle('is-hidden', !checkbox.checked);

        if (!checkbox.checked) input.value = '';
      });
    };

    const initManualInputRangeListeners = (inputs) => {
      inputs.forEach((id) => {
        document.getElementById(id).addEventListener('input', function (e) {
          const match = e.target.value.match(/[a-zA-Z][0-9]+:[a-zA-Z][0-9]+/);
          selectedRange = null;

          if (match && match.length > 0) {
            selectedRange = match[0];
            updateTextField(selectedRange, null, id);
          }
        });
      });
    };

    document.addEventListener('DOMContentLoaded', function () {
      initPhonePrefixToggler();
      initManualInputRangeListeners([
        'emails-range',
        'phones-range',
        'phones-prefix-range',
      ]);
    });
  }, []);

  const openTab = (event, tabTitle) => {
    let tabContent;
    let tabLinks;
    let target;
    tabContent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = 'none';
      tabContent[i].className = tabContent[i].className.replace(
        'is-active',
        ''
      );
    }

    tabLinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace('is-active', '');
    }

    target = document.getElementById(tabTitle);
    target.style.display = 'block';
    target.classList.remove('is-hidden');
    target.className += ' is-active';
    event.currentTarget.parentElement.classList.add('is-active');
  };

  const validate = (event, source) => {
    event.preventDefault();

    const data = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      data[key] = value;
    });

    data.formatOption = document.getElementById('formatOption').value;

    toggleLoaderOverlay(true);
    google.script.run.validate(source, data);
  };

  const pickRange = (button) => {
    button.innerHTML = 'Picking...';
    button.disabled = true;
    google.script.run
      .withSuccessHandler(updateTextField)
      .withUserObject(button)
      .getSelectedRange();
  };

  const updateTextField = (range, button = null, id = null) => {
    if (button) id = button.id.split('_').shift();

    document.getElementById(id).value = range;

    if (button) {
      button.innerHTML = 'Pick selected range';
      button.disabled = false;
    }

    selectedRange = range;
  };

  const toggleLoaderOverlay = (force = undefined) => {
    const overlay = document.getElementById('loader-overlay');
    overlay.classList.toggle('is-active', force);
  };

  return (
    <div>
      <style>
        {`
          .foxentry-tabs-nav li.tablink {
            width: 50%;
            padding: 0;
            text-align: center;
            cursor: pointer;
          }

          .is-hidden {
            display: none;
          }

          .pick-range-button {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            position: relative;
            top: -2px;
            height: auto;
            margin-bottom: 0;
          }

          #loader-overlay {
            position: fixed;
          }
        `}
      </style>

      <p>
        <b>Phone and Email validation by Foxentry</b>
      </p>

      <div id="loader-overlay" className="foxentry-loader">
        <div className="foxentry-loader__main">
          <div className="foxentry-loader__ico">
            <img
              src="https://cdn.foxentry.com/gsheets_addon/images/logo.svg"
              alt=""
              width="32"
            />
          </div>
          <div className="foxentry-loader__desc">Validating data...</div>
        </div>
      </div>

      <header className="foxentry-dialog__header pt-0">
        <div className="d-flex align-items-center py-3 border-bottom justify-content-center">
          <a
            href="https://foxentry.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <img
              src="https://cdn.foxentry.com/gsheets_addon/images/logo-text.svg"
              alt="Foxentry"
              width="122"
              height="28"
            />
          </a>
        </div>
        <div className="foxentry-tabs-nav js-foxentry-tabs-nav">
          <ul className="d-flex justify-content-between">
            <li className="tablink is-active">
              <a onClick={(e) => openTab(e, 'Emails')}>E-mails</a>
            </li>
            <li className="tablink">
              <a onClick={(e) => openTab(e, 'Phones')}>Phones</a>
            </li>
          </ul>
        </div>
      </header>

      <div className="container pt-4">
        <div className="tabcontent" id="Emails">
          <form
            name="email-validate-form"
            onSubmit={(e) => validate(e, 'email')}
          >
            <div className="pb-4">
              <label htmlFor="emails-range" className="form-label">
                Range emails
              </label>
              <input
                type="text"
                id="emails-range"
                name="range"
                className="form-control"
                placeholder="A2:A10"
                required
              />
              <button
                type="button"
                id="emails-range_button"
                className="foxentry-btn foxentry-btn--midi pick-range-button"
                onClick={() => pickRange(this)}
              >
                <span>Pick from sheet</span>
              </button>
            </div>
            <div className="pb-4">
              <label htmlFor="validationType" className="form-label">
                Validation type
              </label>
              <select
                id="validationType"
                name="validationType"
                className="form-select js-foxentry-input-pair"
                data-input-target="#validationType"
              >
                <option value="extended" selected>
                  Extended
                </option>
                <option value="basic">Basic</option>
              </select>
            </div>
            <div className="pb-4">
              <label htmlFor="acceptDisposableEmails" className="form-label">
                Accept disposable e-mails
              </label>
              <select
                id="acceptDisposableEmails"
                name="acceptDisposableEmails"
                className="form-select js-foxentry-input-pair"
                data-input-target="#acceptDisposableEmails"
              >
                <option value="true" selected>
                  True
                </option>
                <option value="false">False</option>
              </select>
            </div>
            <div>
              <label htmlFor="acceptFreemails" className="form-label">
                Accept freemails
              </label>
              <select
                id="acceptFreemails"
                name="acceptFreemails"
                className="form-select js-foxentry-input-pair"
                data-input-target="#acceptFreemails"
              >
                <option value="true" selected>
                  True
                </option>
                <option value="false">False</option>
              </select>
            </div>
            <div className="foxentry-cta">
              <button type="submit" className="foxentry-btn foxentry-btn--midi">
                <span>Validate</span>
              </button>
            </div>
          </form>
        </div>
        <div className="tabcontent is-hidden" id="Phones">
          <form
            name="phone-validate-form"
            onSubmit={(e) => validate(e, 'phone')}
          >
            <div className="pb-2">
              <label htmlFor="phones-range" className="form-label">
                Range phone number
              </label>
              <input
                type="text"
                id="phones-range"
                name="range"
                className="form-control"
                placeholder="A2:A10"
                required
              />
              <button
                type="button"
                id="phones-range_button"
                className="foxentry-btn foxentry-btn--midi pick-range-button"
                onClick={() => pickRange(this)}
              >
                <span>Pick from sheet</span>
              </button>
            </div>
            <div className="pb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="phones-include-prefix"
                  name="phones-include-prefix"
                  className="form-check-input js-foxentry-input-data"
                  value=""
                  data-input-target="#input6"
                  data-input-border="2px dashed #f91d00"
                  data-input-color="#f91d00"
                  data-delay="7000"
                />
                <label
                  htmlFor="phones-include-prefix"
                  className="form-check-label"
                >
                  Include number prefix
                </label>
              </div>
            </div>
            <div id="phones-prefix-range-wrapper" className="pb-4 is-hidden">
              <label htmlFor="phones-prefix-range" className="form-label">
                Prefix range
              </label>
              <input
                type="text"
                id="phones-prefix-range"
                name="prefixRange"
                className="form-control"
                placeholder="A2:A10"
              />
              <button
                type="button"
                id="phones-prefix-range_button"
                className="foxentry-btn foxentry-btn--midi pick-range-button"
                onClick={() => pickRange(this)}
              >
                <span>Pick from sheet</span>
              </button>
            </div>
            <div className="pb-4">
              <label htmlFor="validationType" className="form-label">
                Validation type
              </label>
              <select
                id="validationType"
                name="validationType"
                className="form-select js-foxentry-input-pair"
                data-input-target="#validationType"
              >
                <option value="extended" selected>
                  Extended
                </option>
                <option value="basic">Basic</option>
              </select>
            </div>
            <div className="pb-4">
              <label htmlFor="formatNumber" className="form-label">
                Accept phone numbers with spaces
              </label>
              <select
                id="formatNumber"
                name="formatNumber"
                className="form-select js-foxentry-input-pair"
                data-input-target="#formatNumber"
              >
                <option value="true" selected>
                  True
                </option>
                <option value="false">False</option>
              </select>
            </div>
            <div>
              <label htmlFor="formatOption" className="form-label">
                Phone number format
              </label>
              <select
                id="formatOption"
                name="formatOption"
                className="form-select js-foxentry-input-pair"
                data-input-target="#formatOption"
              >
                <option value="national" title="No prefix, no spaces">
                  National
                </option>
                <option
                  value="nationalFormatted"
                  title="No prefix, with spaces"
                >
                  National Formatted
                </option>
                <option
                  value="international"
                  title="With prefix, no spaces"
                  selected
                >
                  International
                </option>
                <option
                  value="internationalFormatted"
                  title="With prefix, with spaces"
                >
                  International Formatted
                </option>
              </select>
            </div>
            <div className="foxentry-cta">
              <button type="submit" className="foxentry-btn foxentry-btn--midi">
                <span>Validate</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
