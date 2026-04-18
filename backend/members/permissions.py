from rest_framework.permissions import BasePermission


class IsStaffOrMemberRole(BasePermission):
    """Allow access to Django staff users or members with specific roles."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_staff:
            return True

        member = getattr(user, "member_profile", None)
        if not member:
            return False

        allowed_roles = getattr(view, "allowed_member_roles", [])
        return member.role in allowed_roles
