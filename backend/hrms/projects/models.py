from django.db import models
from django.utils.translation import gettext_lazy as _

PROJECT_STATUS_CHOICES = [
    ('in-progress', _('قيد التنفيذ')),
    ('completed', _('مكتمل')),
    ('pending-approval', _('قيد الموافقة')),
    ('paused', _('متوقف')),
]

STATUS_CHOICES = [
    ('completed', _('مكتمل')),
    ('incomplete', _('غير مكتمل')),
    ('overdue', _('متأخر')),
]

PRIORITY_CHOICES = [
    ('low', _('منخفض')),
    ('medium', _('متوسط')),
    ('high', _('مرتفع')),
]


class Project(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name=_("اسم المشروع"),
        error_messages={
            'blank': _("يرجى إدخال اسم المشروع."),
            'max_length': _("اسم المشروع طويل جدًا."),
        },
    )
    status = models.CharField(
        max_length=20,
        choices=PROJECT_STATUS_CHOICES,
        default='pending-approval',
        verbose_name=_("الحالة"),
    )
    start_date = models.DateField(
        verbose_name=_("تاريخ البدء"),
        error_messages={'invalid': _("يرجى إدخال تاريخ صالح.")},
    )
    end_date = models.DateField(
        verbose_name=_("تاريخ الانتهاء"),
        error_messages={'invalid': _("يرجى إدخال تاريخ صالح.")},
    )
    assigned_team = models.ForeignKey(
        'employees.Employee',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("الفريق المسؤول"),
    )
    client = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name=_("العميل"),
    )
    team_members = models.ManyToManyField(
        'employees.Employee',
        related_name='projects',
        verbose_name=_("أعضاء الفريق"),
        blank=True,
    )
    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name=_("الميزانية"),
        error_messages={
            'invalid': _("يرجى إدخال رقم صحيح."),
        },
    )
    description = models.TextField(
        verbose_name=_("الوصف"),
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = _("مشروع")
        verbose_name_plural = _("المشاريع")

    def __str__(self):
        return self.name


class Task(models.Model):
    title = models.CharField(
        max_length=255,
        verbose_name=_("عنوان المهمة"),
        error_messages={
            'blank': _("يرجى إدخال عنوان المهمة."),
            'max_length': _("عنوان المهمة طويل جدًا."),
        },
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("الوصف"),
    )
    department = models.CharField(
        max_length=100,
        verbose_name=_("القسم"),
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="incomplete",
        verbose_name=_("الحالة"),
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="low",
        verbose_name=_("الأولوية"),
    )
    due_date = models.DateField(
        verbose_name=_("تاريخ الاستحقاق"),
        error_messages={
            'invalid': _("يرجى إدخال تاريخ صالح."),
        },
    )
    assigned_to = models.ManyToManyField(
        'employees.Employee',
        related_name="tasks",
        verbose_name=_("الموظف المكلّف"),
    )
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks",
        verbose_name=_("المشروع"),
    )

    class Meta:
        verbose_name = _("مهمة")
        verbose_name_plural = _("المهام")

    def __str__(self):
        return self.title
