INSERT INTO email_templates (email_type,template,mes_subject,comment_text,fields) VALUES ('reset_pwd','������������ [user] ������� ������. ����� ������ [pwd]','����� ������','',array['user','pwd']);
INSERT INTO email_templates (email_type,template,mes_subject,comment_text,fields) VALUES ('new_account','������� ����� ������� ������. ��������� ������� ������: �����: [user] ������: [pwd]','����� ������� ������','',array['user','pwd']);

INSERT INTO email_templates (email_type,template,mes_subject,comment_text,fields) VALUES ('user_email_conf','������������ [user] ���������� ����������� ����� ����������� �����. ��������� �� ������: http://localhost/expert72/index.php?c=User_Controller&f=email_confirm&key=[key] ������ ����� ����������� � ������� �����.','������������� ������.�����.','',array['user','key']);

