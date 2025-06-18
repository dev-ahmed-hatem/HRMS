from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class Attendance(models.Model):
    employee = models.ForeignKey(
        'employees.Employee',
        on_delete=models.CASCADE,
        verbose_name=_("الموظف")
    )

    date = models.DateField(
        verbose_name=_("تاريخ الحضور"),
        error_messages={
            'invalid': _("يرجى إدخال تاريخ صحيح."),
            'null': _("يرجى تحديد التاريخ.")
        }
    )

    check_in = models.TimeField(
        verbose_name=_("وقت الحضور"),
        error_messages={
            'invalid': _("يرجى إدخال وقت صالح."),
            'null': _("يرجى إدخال وقت الحضور.")
        }
    )

    check_out = models.TimeField(
        null=True,
        blank=True,
        verbose_name=_("وقت الانصراف"),
        error_messages={
            'invalid': _("يرجى إدخال وقت صالح.")
        }
    )

    class Meta:
        verbose_name = _("تسجيل حضور")
        verbose_name_plural = _("تسجيلات الحضور")
        ordering = ['id']
        unique_together = ["date", "employee"]

    def __str__(self):
        return f"{self.employee} - {self.date.strftime('%Y-%m-%d')} {self.check_in.strftime('%H:%M')}"

    def clean(self):
        # Ensure check_out is not earlier than check_in
        if self.check_out and self.check_out < self.check_in:
            raise ValidationError({
                'check_out': _("وقت الانصراف لا يمكن أن يكون قبل وقت الحضور.")
            })