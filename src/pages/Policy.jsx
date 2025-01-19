// PrivacyPolicy.js
import React from 'react';
import './PrivacyPolicy.css'; // قم بإنشاء ملف CSS للتصميم

const PrivacyPolicy = () => {
    console.log("please ")
  return (
    <div className="policy-container">
      <h1 className="policy-title">سياسة الخصوصية</h1>
      <p className="policy-text">
        مرحبًا بكم في صفحة سياسة الخصوصية الخاصة بتطبيق سكني. نحن نقدّر خصوصيتكم ونسعى لحماية بياناتكم
        الشخصية أثناء استخدامكم لتطبيقنا الذي يقدم خدمات الحجز، الإيجار، والبيع للعقارات.
      </p>

      <h2 className="policy-heading">المعلومات التي نجمعها</h2>
      <p className="policy-text">
        نحن نقوم بجمع المعلومات التي تتيح لنا تقديم أفضل تجربة للمستخدم. يشمل ذلك المعلومات الأساسية
        مثل الاسم وعنوان البريد الإلكتروني، بالإضافة إلى معلومات حول تفضيلاتكم والنشاطات التي تقومون
        بها داخل التطبيق.
      </p>

      <h2 className="policy-heading">كيفية استخدام المعلومات</h2>
      <p className="policy-text">
        نستخدم المعلومات التي نجمعها لتخصيص تجربتكم، تحسين خدماتنا، والتواصل معكم بشأن حساباتكم والخدمات
        التي نقدمها. لن نشارك بياناتكم الشخصية مع أي طرف ثالث إلا في حالة الضرورة القصوى أو الامتثال
        للقوانين.
      </p>

      <h2 className="policy-heading">حماية البيانات</h2>
      <p className="policy-text">
        نحن نعمل بجد لحماية بياناتكم من الوصول غير المصرح به أو التغيير أو الإفشاء أو التدمير. تعتمد
        إجراءاتنا الأمنية على أفضل الممارسات لحماية بياناتكم.
      </p>

      <h2 className="policy-heading">تعديلات على سياسة الخصوصية</h2>
      <p className="policy-text">
        قد نقوم بتحديث سياسة الخصوصية هذه من حين لآخر. نشجعكم على مراجعة هذه الصفحة بانتظام للبقاء
        على اطلاع حول كيفية حماية معلوماتكم.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
